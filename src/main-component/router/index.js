import React from 'react';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import ScrollToTop from '../../components/ScrollToTop';

import Homepage from '../HomePage'
import AboutPage from '../AboutPage'
import ProjectPage from '../ProjectPage'
import ProjectSinglePage from '../ProjectSinglePage'
import ServicePage from '../ServicePage'
import ServiceSinglePage from '../ServiceSinglePage'
import PortfolioPage from '../PortfolioPage'
import TeamPage from '../TeamPage'
import FaqPage from '../FaqPage'
import ContactPage from '../ContactPage'
import ErrorPage from '../ErrorPage'
import BlogPage from '../BlogPage'
import BlogSinglePage from '../BlogSinglePage'

// Admin Pages
import LoginPage from '../../admin/pages/LoginPage'
import DashboardPage from '../../admin/pages/DashboardPage'
import BannersPage from '../../admin/pages/BannersPage'
import AdminServicesPage from '../../admin/pages/ServicesPage'
import ToolsPage from '../../admin/pages/ToolsPage'
import ClientsPage from '../../admin/pages/ClientsPage'
import PartnersPage from '../../admin/pages/PartnersPage'
import AdminTeamPage from '../../admin/pages/TeamPage'
import ReviewsPage from '../../admin/pages/ReviewsPage'
import AdminPortfolioPage from '../../admin/pages/PortfolioPage'
import AdminProjectsPage from '../../admin/pages/ProjectsPage'
import SettingsPage from '../../admin/pages/SettingsPage'
import ProtectedRoute from '../../admin/components/ProtectedRoute'
import { Redirect } from 'react-router-dom'

      

const AllRoute = () => { 

  return (
    <div>
       <Router>
          <ScrollToTop />
          <Switch>
            <Route exact path='/' component={Homepage}/>
            <Route path='/home' component={Homepage} />
            <Route path='/about' component={AboutPage} />
            <Route path='/projects' component={ProjectPage} />
            <Route path='/project-details/:id' component={ProjectSinglePage} />
            <Route path='/service' component={ServicePage} />
            <Route path='/service-single' component={ServiceSinglePage} />
            <Route path='/portfolio' component={PortfolioPage} />
            <Route path='/team' component={TeamPage} />
            <Route path='/faq' component={FaqPage} />
            <Route path='/contact' component={ContactPage} />
            <Route path='/404' component={ErrorPage} />
            <Route path='/blog' component={BlogPage} />
            <Route path='/blog-single' component={BlogSinglePage} />
            
            {/* Admin Routes */}
            <Route exact path="/admin/login" component={LoginPage} />
            <Route exact path="/admin">
              <Redirect to="/admin/login" />
            </Route>
            <ProtectedRoute exact path="/admin/dashboard" component={DashboardPage} />
            <ProtectedRoute exact path="/admin/banners" component={BannersPage} />
            <ProtectedRoute exact path="/admin/services" component={AdminServicesPage} />
            <ProtectedRoute exact path="/admin/tools" component={ToolsPage} />
            <ProtectedRoute exact path="/admin/clients" component={ClientsPage} />
            <ProtectedRoute exact path="/admin/partners" component={PartnersPage} />
            <ProtectedRoute exact path="/admin/team" component={AdminTeamPage} />
            <ProtectedRoute exact path="/admin/reviews" component={ReviewsPage} />
            <ProtectedRoute exact path="/admin/portfolio" component={AdminPortfolioPage} />
            <ProtectedRoute exact path="/admin/projects" component={AdminProjectsPage} />
            <ProtectedRoute exact path="/admin/settings" component={SettingsPage} />
          </Switch>
      </Router>
    </div>
  );
}

export default AllRoute;
