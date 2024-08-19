import React, {Fragment} from 'react';
import Header from '../../components/header'
import Hero from '../../components/hero'
import About from '../../components/about'
import ServiceSection from '../../components/ServiceSection'
import Tour from '../../components/tour'
import Partners from '../../components/partners'
import ProjectSection from '../../components/ProjectSection'
import Testimonial from '../../components/testimonial'
import BlogSection from '../../components/BlogSection'
import Footer from '../../components/footer'
import { usedTools } from '../../Dashboard/dashboard';


const HomePage =() => {
    return(
        <Fragment>
            <Header/>
            <Hero/>
            <About/>
            <ServiceSection/>
            <Tour/>
            <Partners usedTools={usedTools}/>
            <ProjectSection/>
            <Testimonial/>
            {/* <BlogSection/> */}
            <Footer/>
        </Fragment>
    )
};
export default HomePage;

