'use client';
import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';



function ContactPage() {

  const {ref, inView} = useInView({
threshold:0.2,
triggerOnce:true
  })

  const {ref:Submit, inView:sinView} =useInView({
threshold:0.2,
triggerOnce:true

  })
  const [formData, setFormData] = useState<{ name: string; email: string; message: string }>({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});








  const validate = () => {
    let tempErrors: { [key: string]: string } = {};
    if (!formData.name) tempErrors.name = 'Name is required';
    if (!formData.email) {
      tempErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = 'Invalid email format';
    }
    if (!formData.message) tempErrors.message = 'Message is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit =  async (e:any) => {
    e.preventDefault();
    if (validate()) {

      try{ 

        const res = fetch('/api/contact', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),

        })

        console.log('Form submitted successfully:', res);
        alert('Form submitted successfully!');
      }catch(err){
        alert('Error submitting form.try again later.');
        console.log('Form submission error:', err);
      }finally{
            setFormData({ name: '', email: '', message: '' });
      }

    
    }
  };

  return (
    <div className=" bg-inherit   min-h-screen flex items-center justify-center   p-5">
  
      <div className={` shadow-lg   rounded-xl p-8 w-full max-w-lg`} ref={ref}>
        <h2 className={`text-2xl font-bold text-blue-600 mb-5 text-center  transition-all duration-1000  relative after:absolute after:bottom-0 after:content-[''] after:bg-amber-950 
           
          ${inView ? 'opacity-100 translate-x-0  ':'translate-x-50 opacity-0'} `}>
          Contact SecureFund
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
            />
            {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
          </div>

          <button 
          ref={Submit}
            type="submit"
            className={`w-full bg-[#191097] text-white font-semibold py-2 rounded-lg hover:bg-[#0b3eb4] transition-all duration-1000
               ${sinView ?'translate-y-0 opacity-100':'translate-y-[1npm r0px] opacity-0 '}`}
          onClick={ (e) => handleSubmit(e)}
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactPage;
