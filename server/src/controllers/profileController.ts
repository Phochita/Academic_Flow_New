import expressTypes = require("express");
import path = require("node:path");
import zod = require("zod");
import profileService = require("../services/profile");
import supabaseUtils = require("../utils/supabase");
import httpUtils = require("../utils/http");

const { z } = zod;
const { buildFullName, getProfileById, updateProfileById } = profileService;
const { HttpError } = httpUtils;
const { supabaseAdmin } = supabaseUtils;
const avatarBucketName = "avatars";
const maxAvatarFileSizeBytes = 2 * 1024 * 1024;
const allowedAvatarMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const nullableTrimmedString = (maxLength: number) =>
  z.union([z.string().trim().max(maxLength), z.null()]).optional();

const updateProfileSchema = z
  .object({
    academicBio: z.union([z.string().trim().max(500), z.null()]).optional(),
    address: nullableTrimmedString(160),
    avatarUrl: nullableTrimmedString(2048),
    batch: nullableTrimmedString(80),
    classYear: z.union([z.number().int().min(1900).max(2100), z.null()]).optional(),
    currentGpa: z.union([z.number().min(0).max(4), z.null()]).optional(),
    department: nullableTrimmedString(120),
    earnedCredits: z.union([z.number().int().min(0).max(500), z.null()]).optional(),
    firstName: z.string().trim().min(1).max(60).optional(),
    lastName: z.string().trim().min(1).max(60).optional(),
    phoneNumber: nullableTrimmedString(40),
  })
  .strict();

const uploadAvatarSchema = z
  .object({
    contentType: z.string().trim().min(1).max(100),
    dataUrl: z.string().trim().min(1),
    fileName: z.string().trim().min(1).max(255),
  })
  .strict();

const formatProfile = (profile: NonNullable<Awaited<ReturnType<typeof getProfileById>>>) => ({
  academicBio: profile.academicBio ?? null,
  address: profile.address ?? null,
  avatarUrl: profile.avatarUrl ?? null,
  batch: profile.batch ?? null,
  classYear: profile.classYear ?? null,
  createdAt: profile.createdAt?.toISOString() ?? null,
  currentGpa: profile.currentGpa ?? null,
  department: profile.department ?? null,
  earnedCredits: profile.earnedCredits ?? null,
  email: profile.email ?? null,
  firstName: profile.firstName ?? null,
  fullName: profile.fullName ?? null,
  id: profile.id,
  isPro: Boolean(profile.isPro),
  lastName: profile.lastName ?? null,
  lastSeenAt: profile.lastSeenAt?.toISOString() ?? null,
  phoneNumber: profile.phoneNumber ?? null,
  role: profileService.normalizeRole(profile.role),
  status: profile.status ?? "active",
});

const sanitizeAvatarFileName = (fileName: string) => {
  const extension = path.extname(fileName).toLowerCase();
  const safeBaseName = path
    .basename(fileName, extension)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${safeBaseName || "avatar"}${extension}`;
};

const ensureAvatarBucket = async () => {
  const { data: buckets, error: listBucketsError } = await supabaseAdmin.storage.listBuckets();

  if (listBucketsError) {
    throw new HttpError(500, listBucketsError.message ?? "Unable to access storage buckets.");
  }

  if (buckets?.some((bucket) => bucket.name === avatarBucketName)) {
    return;
  }

  const { error: createBucketError } = await supabaseAdmin.storage.createBucket(avatarBucketName, {
    allowedMimeTypes: [...allowedAvatarMimeTypes],
    public: true,
  });

  if (createBucketError && !createBucketError.message.toLowerCase().includes("already exists")) {
    throw new HttpError(500, createBucketError.message ?? "Unable to create the avatar storage bucket.");
  }
};

const decodeAvatarDataUrl = (dataUrl: string, expectedContentType: string) => {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);

  if (!match) {
    throw new HttpError(400, "Invalid image data. Please choose the file again.");
  }

  const [, actualContentType, base64Payload] = match;

  if (!base64Payload) {
    throw new HttpError(400, "Invalid image data. Please choose the file again.");
  }

  if (actualContentType !== expectedContentType) {
    throw new HttpError(400, "Image metadata did not match the uploaded file type.");
  }

  const buffer = Buffer.from(base64Payload, "base64");

  if (buffer.length === 0) {
    throw new HttpError(400, "The selected image was empty.");
  }

  if (buffer.length > maxAvatarFileSizeBytes) {
    throw new HttpError(400, "Profile images must be 2 MB or smaller.");
  }

  return buffer;
};

const getMyProfile = async (req: expressTypes.Request, res: expressTypes.Response) => {
  if (!req.auth) {
    throw new HttpError(401, "Authentication is required.");
  }

  const profile = await getProfileById(req.auth.userId);

  if (!profile) {
    throw new HttpError(404, "Profile not found.");
  }

  res.status(200).json({
    profile: formatProfile(profile),
  });
};

const updateMyProfile = async (req: expressTypes.Request, res: expressTypes.Response) => {
  if (!req.auth) {
    throw new HttpError(401, "Authentication is required.");
  }

  const payload = updateProfileSchema.parse(req.body);
  const existingProfile = await getProfileById(req.auth.userId);

  if (!existingProfile) {
    throw new HttpError(404, "Profile not found.");
  }

  const nextFirstName = payload.firstName ?? existingProfile.firstName ?? null;
  const nextLastName = payload.lastName ?? existingProfile.lastName ?? null;
  const nextFullName = buildFullName([nextFirstName, nextLastName]);
  const updates = {
    ...(payload.academicBio !== undefined ? { academicBio: payload.academicBio } : {}),
    ...(payload.address !== undefined ? { address: payload.address } : {}),
    ...(payload.avatarUrl !== undefined ? { avatarUrl: payload.avatarUrl } : {}),
    ...(payload.batch !== undefined ? { batch: payload.batch } : {}),
    ...(payload.classYear !== undefined ? { classYear: payload.classYear } : {}),
    ...(payload.currentGpa !== undefined ? { currentGpa: payload.currentGpa } : {}),
    ...(payload.department !== undefined ? { department: payload.department } : {}),
    ...(payload.earnedCredits !== undefined ? { earnedCredits: payload.earnedCredits } : {}),
    ...(payload.firstName !== undefined ? { firstName: payload.firstName } : {}),
    ...(payload.lastName !== undefined ? { lastName: payload.lastName } : {}),
    ...(payload.phoneNumber !== undefined ? { phoneNumber: payload.phoneNumber } : {}),
    fullName: nextFullName,
    lastSeenAt: new Date(),
  };

  const updatedProfile = await updateProfileById(req.auth.userId, updates);

  if (!updatedProfile) {
    throw new HttpError(404, "Profile not found.");
  }

  res.status(200).json({
    message: "Profile updated successfully.",
    profile: formatProfile(updatedProfile),
  });
};

const uploadMyAvatar = async (req: expressTypes.Request, res: expressTypes.Response) => {
  if (!req.auth) {
    throw new HttpError(401, "Authentication is required.");
  }

  const payload = uploadAvatarSchema.parse(req.body);
  const contentType = payload.contentType.trim().toLowerCase();

  if (!allowedAvatarMimeTypes.has(contentType)) {
    throw new HttpError(400, "Please upload a JPG, PNG, WEBP, or GIF image.");
  }

  const existingProfile = await getProfileById(req.auth.userId);

  if (!existingProfile) {
    throw new HttpError(404, "Profile not found.");
  }

  await ensureAvatarBucket();

  const buffer = decodeAvatarDataUrl(payload.dataUrl, contentType);
  const avatarPath = `${req.auth.userId}/${Date.now()}-${sanitizeAvatarFileName(payload.fileName)}`;
  const { error: uploadError } = await supabaseAdmin.storage.from(avatarBucketName).upload(avatarPath, buffer, {
    cacheControl: "3600",
    contentType,
    upsert: true,
  });

  if (uploadError) {
    throw new HttpError(500, uploadError.message ?? "Unable to upload your profile image right now.");
  }

  const { data: publicUrlData } = supabaseAdmin.storage.from(avatarBucketName).getPublicUrl(avatarPath);
  const updatedProfile = await updateProfileById(req.auth.userId, {
    avatarUrl: publicUrlData.publicUrl,
    lastSeenAt: new Date(),
  });

  if (!updatedProfile) {
    throw new HttpError(404, "Profile not found.");
  }

  res.status(200).json({
    message: "Profile photo uploaded successfully.",
    profile: formatProfile(updatedProfile),
  });
};

export = {
  getMyProfile,
  uploadMyAvatar,
  updateMyProfile,
};
