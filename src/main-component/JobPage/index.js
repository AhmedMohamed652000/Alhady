import React, {Fragment} from 'react'
import Header from '../../components/header'
import PageTitle from '../../components/pagetitle'
import JobList from '../../components/JobList'
import Footer from '../../components/footer'

const JobPage =() => {
    return(
        <Fragment>
            <Header/>
            <PageTitle pageTitle={'JOBS'} pagesub={'Career Opportunities'}/>
            <JobList/>
            <Footer/>
        </Fragment>
    )
};

export default JobPage;
