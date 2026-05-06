const banners = [
    {
        page: 'home',
        title: 'BIM & Engineering Excellence',
        subtitle: 'Transforming visions into reality through innovative BIM solutions',
        backgroundImage: '/img/hero-bg.webp'
    },
    {
        page: 'about',
        title: 'About Al-Hady',
        subtitle: 'Leading the way in Architectural Engineering and BIM Consulting',
        backgroundImage: '/img/about-bg.webp'
    },
    {
        page: 'service',
        title: 'Our Services',
        subtitle: 'Comprehensive BIM and Engineering solutions for every project',
        backgroundImage: '/img/service-bg.webp'
    }
];

const services = [
    {
        title: 'Architectural BIM Services',
        sliderImage: 'a1_3.webp',
        description: 'We create interactive architectural bim services 3D models for design presentation and effective design communication to aid Architectural consultants & contractors.',
        link: '/service/test-service',
        cardImage: '/img/a1_3.webp',
        icon: '/img/i1.webp',
        order: 1
    },
    {
        title: 'Structural BIM Services',
        sliderImage: 'a2_3.webp',
        description: 'We deliver structural BIM services to structural / civil engineers in order to build structures of immense strength and well-coordinated with other disciplines.',
        link: '/service/test-service',
        cardImage: '/img/a2_3.webp',
        icon: '/img/i2.webp',
        order: 2
    },
    {
        title: 'MEP BIM Services',
        sliderImage: 'a3_3.webp',
        description: 'We deliver MEP BIM services to MEP contractors and MEP consultants for obtaining coordinated clash free 3D models in a building design layout.',
        link: '/service/test-service',
        cardImage: '/img/a3_3.webp',
        icon: '/img/i3.webp',
        order: 3
    },
    {
        title: 'Infrastructure BIM Services',
        sliderImage: 'a4_3.webp',
        description: 'Enhance collaboration, better project understanding due to 3D visualization, enhanced communication between various parties and generation of dynamic design data that can ultimately be used to support operations, maintenance and asset management.',
        link: '/service/test-service',
        cardImage: '/img/a4_3.webp',
        icon: '/img/i4.webp',
        order: 4
    },
    {
        title: 'BIM Management',
        sliderImage: 'a5_2.webp',
        description: 'Al-Hady, your preferred partner for efficient Building Information Modeling BIM management. Throughout the course of the project, our comprehensive BIM management services promise improved collaboration and facilitated project execution.',
        link: '/service/test-service',
        cardImage: '/img/a5_2.webp',
        icon: '/img/i5.webp',
        order: 5
    }
];

const tools = [
    { title: 'AUTODESK REVIT', icon: '/img/p1_1.webp', order: 1 },
    { title: 'AUTODESK AUTOCAD', icon: '/img/p2_1.webp', order: 2 },
    { title: 'NAVISWORKS', icon: '/img/p3_1.webp', order: 3 },
    { title: '3DS MAX', icon: '/img/p4_1.webp', order: 4 },
    { title: 'AUTODESK BIM 360', icon: '/img/p5_1.webp', order: 5 },
    { title: 'DYNAMO', icon: '/img/p6_1.webp', order: 6 }
];

const clients = [
    { title: 'Client 1', icon: '/img/c1.webp', order: 1 },
    { title: 'Client 2', icon: '/img/c2.webp', order: 2 },
    { title: 'Client 3', icon: '/img/c3.webp', order: 3 },
    { title: 'Client 4', icon: '/img/c4.webp', order: 4 }
];

const partners = [
    { title: 'Partner 1', icon: '/img/partner1.webp', order: 1 }
];

const team = [
    {
        name: 'Mohamed Ibrahim Elhady',
        position: 'Chairman',
        profileImage: '/img/photo/Mohamed_Ibrahim_Elhady.webp',
        order: 1
    },
    {
        name: 'RIZK ABDUL AZIM RIZK ALI',
        position: 'BIM Manager',
        profileImage: '/img/photo/RIZK_ABDUL_AZIM_RIZK_ALI.webp',
        order: 2
    },
    {
        name: 'ASHRAF ABDEL HAMID MOHAMED GHAMRI',
        position: 'Eng.Structure Manager',
        profileImage: '/img/photo/ASHRAF_ABDEL_HAMID_MOHAMED_GHAMRI.webp',
        order: 3
    }
];

const reviews = [
    {
        name: 'John Doe',
        jobTitle: 'Alhady Owner',
        description: 'lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum',
        image: '/img/person1_1.webp'
    },
    {
        name: 'Jane Smith',
        jobTitle: 'Project Manager',
        description: 'Excellent BIM services, highly professional team and timely delivery.',
        image: '/img/person2.webp'
    }
];

const portfolio = [
    {
        title: 'Project Name 1',
        serviceCategory: 'BIM',
        cardImage: '/img/t-1_1_1.webp',
        order: 1
    },
    {
        title: 'Project Name 2',
        serviceCategory: 'BIM',
        cardImage: '/img/t-2_1_1.webp',
        order: 2
    }
];

const projects = [
    {
        title: 'Residential Complex BIM',
        serviceCategory: 'BIM',
        homeCardImage: '/img/a-1_3.webp',
        projectImage: '/img/a-1_3.webp',
        header: 'Integrated BIM for Large Scale Residential',
        description: 'A comprehensive BIM implementation project covering all disciplines.',
        projectDetails: {
            projectType: 'Residential',
            client: 'Global Dev Corp',
            year: '2023',
            location: 'Cairo, Egypt',
            projectSize: '50,000 sqm',
            projectTime: '12 Months',
            peopleWorked: '18',
            projectCost: '$2M',
            statisticsIcon: '/img/a-1_3.webp'
        },
        projectSamples: [
            {
                image: '/img/a-1_3.webp',
                title: 'Main Entrance Render',
                description: 'High fidelity render of the primary access point.'
            }
        ],
        order: 1
    }
];

const settings = {
    companyName: 'Al-Hady BIM & Engineering',
    phone: '+20 123 456 789',
    email: 'info@alhady-bim.com',
    address: 'Cairo, Egypt',
    aboutDescription: 'Al-Hady is a leading provider of BIM and Architectural Engineering services...',
    heroTitle: 'Innovative BIM Solutions',
    heroSubtitle: 'Leading the future of construction engineering',
    yearsExperience: 15,
    projectsCompleted: 200,
    teamSize: 50
};

module.exports = {
    banners,
    services,
    tools,
    clients,
    partners,
    team,
    reviews,
    portfolio,
    projects,
    settings
};
