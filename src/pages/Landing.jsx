import React from 'react'
import { NavLink } from 'react-router-dom'
import { BiBed, BiPencil, BiShareAlt, BiUser } from 'react-icons/bi'
import FadeInSection from '@/components/Landing/FadeInSection'

const Landing = () => {
  return (
    <div className='landing-page relative min-h-screen bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]'>
      <div className='w-full max-w-6xl mx-auto px-4 md:px-6'>
        
        <header className='flex justify-between h-20 items-center'>
          <div className='font-semibold flex items-start gap-1'>
            <img src="https://apnahomz.com/wp-content/uploads/2025/06/webs.png" alt="ApnaHomz" style={{ width: "100px", height: "auto" }} />
            <span className='rounded-lg text-xs'></span>
          </div>
          <div className='flex items-center gap-4'>
            <a className='font-medium text-sm' href='#features'>Features</a>
            <NavLink to={'./plans/all'}>
                  <div className='px-2 h-7 w-fit bg-blue-500 hover:bg-blue-600 text-white rounded font-medium text-xs flex items-center gap-1 cursor-pointer'> Let's draw</div>
                </NavLink>
          </div>
        </header>
        <main>
          
          <div className='flex justify-between pt-14 pb-8 mx-2'>
          <FadeInSection>
            <div className='max-w-xl'>
              <div className='text-5xl font-semibold'>
                Simple and easy<br/>
                Floor Plan Creator
              </div>
              <div className='text-slate-500 text-sm my-2'>
                APNAHOMZ is the simplest and easiest way to draw your floor plans. Whether you're a seasoned interior designer or plan your apartment, APNAHOMZ gives you necessary features to draw your plans.
              </div>
              <div  className="w-fit">
              <NavLink to={'./plans/all'}>
                  <div className='px-2 h-8 w-fit bg-blue-500 hover:bg-blue-600 text-white rounded font-medium text-xs flex items-center gap-1 cursor-pointer'>  <BiPencil /> Get started</div>
                </NavLink>
              </div>
            </div>
           </FadeInSection>

            <div className='flex-1 -mt-5 hidden lg:block'>
           <FadeInSection>
              <div className='font-semibold text-right'>
                Intuitive tools
                <div className='text-xs font-normal text-slate-500'>
                   All necessary tools easily accessible. <br/> Drag-and-drop, zoom in/out and snap <br/> to grid help you speed up your design process.
                </div>
              </div>
                <div className='mt-4 relative'>
                  <img src='./landing/tool1.png' className='animate-float-y w-10 rounded-md shadow-md absolute right-0 top-3'  />
                  <img src='./landing/tool3.png' className='animate-float-x h-9 rounded-md shadow-md absolute right-10 top-8'  />
                  <img src='./landing/tool2.png' className='animate-float-x h-10 rounded-md shadow-md absolute right-12 top-20'  />
                </div>
              </FadeInSection>
            </div>
          </div>

        <div>


          <div className="max-w-4xl mx-auto mt-8">
              <div className='text-center text-xs mb-4 text-slate-400'>
                Draw your floor plan right away.
              </div>
              <div className='shadow-xl rounded-lg hover:scale-[1.025] transition-transform'>
                <div className="w-full h-10 rounded-t-lg bg-white flex justify-start items-center space-x-1.5 px-3 border">
                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-300"></span>
                    <span className="w-3 h-3 rounded-full bg-green-400"></span>
                </div>
                
                <div className="border-t-0 rounded-b-lg border group relative">
                  <img src='./landing/screen3.png' className='rounded-b-lg' />
                  <div className='opacity-0 group-hover:opacity-100 absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center  bg-black/10 transition-all duration-300' >
                    <NavLink to={'./plans/all'}>
                    <div className='shadow-xl bg-white p-8 rounded-full hover:bg-yellow-300'>
                      <BiPencil size={30} />
                    </div>
                    </NavLink>
                  </div>
                </div>
              </div>
          </div>

        </div>

        <div className="max-w-7xl grid lg:grid-cols-3 gap-6 lg:gap-8 py-10 lg:py-20 lg:pb-10 px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="relative sm:pe-6 ">
            <div className="ms-6">
            <BiUser size={20}/>
              <h2 className="font-semibold mb-1">User-Friendly Interface</h2>
              <p className="text-sm text-slate-500 leading-normal dark:text-neutral-400">
              Easy-to-use interface ensures that you can start designing immediately, no prior experience required.</p>
            </div>
          </div>

          <div className="relative pt-6 sm:pt-0">
            <div className="ms-6">
            <BiBed size={20}/>
              <h2 className="font-semibold mb-1">Basic Furnishing Library</h2>
              <p className="text-sm text-slate-500 leading-normal dark:text-neutral-400">
              Add sofas, beds, kitchen units, and more to  visualize your space in detail.</p>
            </div>
            <div className="absolute top-0 start-0 w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent sm:hidden lg:block sm:bg-gradient-to-t sm:w-px sm:h-full "></div>
          </div>

          <div className="relative pt-6 sm:pt-0">
            <div className="ms-6">
          <BiShareAlt size={20}/>
              <h2 className="font-semibold mb-1">Save and Share</h2>
              <p className="text-sm text-slate-500 leading-normal dark:text-neutral-400 ">
                Save your projects and share them with anyone. Collaborate easily by sharing your floor plans link.</p>
            </div>
            <div className="absolute top-0 start-0 w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent sm:hidden lg:block sm:bg-gradient-to-t sm:w-px sm:h-full "></div>
          </div>
          </div>

        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
          <h2 className="text-2xl font-bold md:text-3xl " id='features'>
            Features
          </h2>

          <p className="text-slate-500 mt-2 text-sm">
            Don't wait to bring your ideas to life. Get started with Floor Lite  and see how easy and fun designing your space can be.
          </p>
        </div>

        <div className="max-w-5xl mx-auto text-center mb-10 lg:mb-14">

          <div className='grid grid-cols-12 gap-4 xl:gap-6'>

          <div className='col-span-12 md:col-span-6 lg:col-span-4 md:order-1 flex flex-col gap-4 xl:gap-6'>
             
              <div className='relative overflow-hidden shadow-md bg-white bg-whiterounded-lg rounded-lg flex flex-col items-center  px-5 py-10 h-[300px] hover:scale-[1.05] transition-transform duration-300'>
                  <h3 className='text-xl font-semibold'>Zoom In and Out</h3>
                  <div className='text-sm mt-2 text-slate-500'>
                  Easily zoom in for detailed work or zoom out to see the bigger picture. This flexibility helps you perfect every aspect of your design.
                  </div>
                  <div className='absolute -bottom-10 right-0 -z-0 w-60'>
                    <img className=' rounded-md ' src='./landing/zoom.png'/>
                  </div>
              </div>

              <div className='relative overflow-hidden flex-1 shadow-md bg-white rounded-lg flex flex-col items-center px-5 py-10 hover:scale-[1.05] transition-transform duration-300'>
                  <h3 className='text-xl font-semibold z-10'>Draw Walls Easily</h3>
                  <div className='text-sm mt-2 text-slate-500 z-10 w-4/5'>
                    Create walls with ease. Our drawing tools allow you to add, and remove walls quickly, making the process of designing your space straightforward.
                  </div>
                  <div className='absolute left-5 w-96 -bottom-14 -z-0'>
                    <img className=' rounded-md ' src='./landing/walls.png'/>
                  </div>
              </div>
              </div>

            <div className='col-span-12 md:col-span-6 lg:col-span-4 md:order-2 flex flex-col gap-4 xl:gap-6'>
            <div className='relative overflow-hidden shadow-md bg-white rounded-lg flex flex-col items-center px-5 py-10 h-[390px] hover:scale-[1.05] transition-transform duration-300'>
                  <h3 className='text-xl font-semibold z-10'> Save and Share</h3>
                  <div className='text-sm mt-2 text-slate-500 z-10'>
                  Save your projects and share them with others. Collaborate easily by sharing your floor plans via email or social media.
                  </div>
                  <div className='absolute -bottom-16 -right-4 -z-0 w-72'>
                    <img className='shadow-xl rounded-md border' src='./landing/projects.png'/>
                  </div>
              </div>

              <div className='relative overflow-hidden shadow-md bg-white rounded-lg flex flex-col items-center px-5 py-10 h-[240px] hover:scale-[1.05] transition-transform duration-300'>
                  <h3 className='text-xl font-semibold z-10'>  Snap to Grid</h3>
                  <div className='text-sm mt-2 text-slate-500 z-10'>
                  Achieve alignment with snap to grid feature.
                  </div>
                  <div className='absolute -bottom-8 -z-0 w-72'>
                    <img className=' rounded-md ' src='./landing/snap.png'/>
                  </div>
              </div>

            </div>

            <div className='col-span-12 md:col-span-6 lg:col-span-4 md:order-3 flex flex-col gap-4 xl:gap-6'>
            <div className='relative overflow-hidden shadow-md bg-white rounded-lg flex flex-col items-center  px-5 py-10 h-[300px] hover:scale-[1.05] transition-transform duration-300'>
                  <h3 className='text-xl font-semibold z-10'> Show and Hide Grid</h3>
                  <div className='text-sm mt-2 text-slate-500 z-10'>
                  Toggle the grid view on and off according to your needs. Use the grid or hide it for a cleaner view of your design.
                  </div>
                  <div className='absolute bottom-0 -z-0'>
                    <img className='shadow-xl rounded-md ' src='./landing/grid.png'/>
                  </div>
                  <div className='absolute bottom-16 -z-0 w-44'>
                    <img className='shadow-md rounded-md ' src='./landing/tool4.png'/>
                  </div>
              </div>
              <div className='relative overflow-hidden flex-1  shadow-md bg-white rounded-lg flex flex-col items-center justify-start px-5 py-10 hover:scale-[1.05] transition-transform duration-300'>
                  <h3 className='text-xl font-semibold'>  Generate Link to Preview</h3>
                  <div className='text-sm mt-2 text-slate-500'>
                  Share your designs effortlessly by generating a unique link. Allow others to preview your floor plans online without needing to download any software.
                  </div>
                  <div className='absolute bottom-10 -z-0 w-72'>
                    <img className=' rounded-md ' src='./landing/share.png'/>
                  </div>
              </div>
            </div>
          </div>
        </div>

      <FadeInSection>
        <div className="max-w-2xl mx-auto flex flex-col justify-center items-center my-20">
          <h2 className="text-2xl font-bold md:text-3xl mb-2">
            Floor Plan Creator
          </h2>

          <NavLink to={'./plans/all'}>
             <div className='p-2 px-4 w-fit bg-blue-500 hover:bg-blue-600 text-white rounded font-medium flex items-center gap-1 cursor-pointer'>  <BiPencil /> Get started</div>
          </NavLink>
          <p className="text-slate-500 mt-2 text-sm text-center">
          APNAHOMZ makes floor plan design accessible to everyone. Tool for anyone looking to design floor plans quickly and effortlessly.
          </p>
        </div>
        </FadeInSection>
        </main>
          <footer className="flex items-center justify-between rounded-md px-6 py-10 text-slate-500">
                  <span className='text-sm'>© APNAHOMZ 2024</span>
                  <a href="#" className="text-sm">Project page</a>
          </footer>
      </div>
    </div>
  )
}

export default Landing