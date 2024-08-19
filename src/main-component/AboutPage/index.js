import React, {Fragment} from 'react'
import Header from '../../components/header'
import PageTitle from '../../components/pagetitle'
import Feature from '../../components/feature'
import Partners from '../../components/partners'
import Expertise from '../../components/expertise'
import Team from '../../components/team'
import Footer from '../../components/footer'

const usedTools = [
    { title: "Zimbra", icon: "path/to/zimbra-icon.png" },
    { title: "Google Cloud", icon: "path/to/google-cloud-icon.png" },
    { title: "Microsoft", icon: "path/to/microsoft-icon.png" },
    // Add more tools here
  ];
  
  const clients = [
    { title: "Client 1", icon: "path/to/client1-icon.png" },
    { title: "Client 2", icon: "path/to/client2-icon.png" },
    // Add more clients here
  ];
  
  const partners = [
    { title: "Partner 1", icon: "path/to/partner1-icon.png" },
    { title: "Partner 2", icon: "path/to/partner2-icon.png" },
    // Add more partners here
  ];

const AboutPage =() => {
    return(
        <Fragment>
            <Header/>
            <PageTitle pageTitle={'About Us'} pagesub={'About'}/>
            <Feature/>
            <Partners usedTools={usedTools} clients={clients} partners={partners} />
            <Expertise/>
            <Team/>
            <Footer/>
        </Fragment>
    )
};
export default AboutPage;

