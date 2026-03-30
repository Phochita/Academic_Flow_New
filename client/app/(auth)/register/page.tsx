
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex font-sans text-[15px]">
      {/* Left Side - Visual/Gradient (Consistent with Login) */}
      <div className="hidden lg:flex w-1/2 gradient-bg px-10 py-10 flex-col justify-between text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-12">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center font-bold text-xl">
              A
            </div>
            <span className="text-2xl font-bold tracking-tight">AcaFlow</span>
          </div>
          
          <h2 className="text-4xl font-extrabold leading-tight mb-5">
            Start Your <br />
            Academic Revolution.
          </h2>
          <p className="text-lg text-white/80 max-w-md leading-8">
            The most advanced platform for university management and AI-powered learning.
          </p>
        </div>
        
        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="flex space-x-2 mb-4">
               {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400">★</span>)}
            </div>
            <p className="text-base font-medium mb-4 leading-7">
              &ldquo;Finally, a system that actually understands how modern universities work. The lecturer tools are incredibly intuitive.&rdquo;
            </p>
            <div className="flex items-center space-x-4">
               <div className="w-12 h-12 bg-white/30 rounded-full"></div>
               <div>
                  <div className="font-bold">Dr. Michael Chen</div>
                  <div className="text-sm text-white/60">Senior Lecturer, MIT</div>
               </div>
            </div>
          </div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 bg-background flex items-center justify-center p-7 md:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white font-bold text-xl">
              A
            </div>
            <span className="text-2xl font-bold text-text-primary tracking-tight">AcaFlow</span>
          </div>

          <h1 className="text-2xl font-bold text-text-primary mb-2">Create Account</h1>
          <p className="text-text-secondary mb-7">Join the AcaFlow community today.</p>

          <form className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">First Name</label>
                  <input 
                     type="text" 
                     placeholder="John"
                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">Last Name</label>
                  <input 
                     type="text" 
                     placeholder="Doe"
                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
               </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="name@university.edu"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>

            {/* Role Selection - Strict Requirement */}
            <div>
               <label className="block text-sm font-semibold text-text-primary mb-3">I am a...</label>
               <div className="grid grid-cols-3 gap-3">
                  {['Student', 'Lecturer', 'Admin'].map((role) => (
                     <label key={role} className="relative cursor-pointer group">
                        <input type="radio" name="role" value={role.toLowerCase()} className="peer sr-only" defaultChecked={role === 'Student'} />
                        <div className="px-3 py-2.5 text-center rounded-xl border border-gray-200 text-sm font-bold text-text-secondary peer-checked:border-primary peer-checked:text-primary peer-checked:bg-primary/5 transition-all group-hover:bg-gray-50">
                           {role}
                        </div>
                     </label>
                  ))}
               </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>

             <div className="text-xs text-text-secondary leading-relaxed">
               By clicking &ldquo;Create Account&rdquo;, you agree to our <Link href="#" className="font-bold text-primary underline">Terms of Service</Link> and <Link href="#" className="font-bold text-primary underline">Privacy Policy</Link>.
            </div>

            <button className="w-full py-3.5 rounded-xl gradient-bg text-white font-bold shadow-soft hover:opacity-90 transition-all">
              Create Account
            </button>
          </form>

          <p className="text-center mt-8 text-text-secondary">
            Already have an account? <Link href="/login" className="font-bold text-primary hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
