import { NodeCategory } from "../enums/graph.enum";
import { GraphContent } from "../models/graph.interface";

export const GRAPH_CONTENT = [
    {
        title: NodeCategory.Projects,
        color: '#4CE0B3',
        elements: [
            {
                title: 'Messaging Service',
                color: '#00a9a5'
            },
            {
                title: 'IoT Weather Station',
                color: '#00a9a5'
            },
            {
                title: 'Password Cracking',
                color: '#00a9a5'
            },
            {
                title: 'Forensic Analysis',
                color: '#00a9a5'
            },
            {
                title: 'Vulnerability Report',
                color: '#00a9a5'
            },
            {
                title: 'Full-stack E-commerce',
                color: '#00a9a5'
            },
            {
                title: 'Galaga Videogame',
                color: '#00a9a5'
            },
            {
                title: 'Image PreProcessor',
                color: '#00a9a5'
            },
        ]
    },
    {
        title: NodeCategory.Experience,
        color: '#e63946',
        elements: [
            {
                title: 'Accenture',
                color: '#d13440'
            },
            {
                title: 'Deimos Space',
                color: '#d13440'
            },
            {
                title: 'TheCodeLives',
                color: '#d13440'

            }
        ]
    },
    {
        title: NodeCategory.About_me,
        
        color: '#480ca8',
        elements: [
            {
                title: NodeCategory.Tech_stack,
                color: '#560bad',
                elements: [
                    {
                        title: 'Backend',
                        color: '#560bad',
                        elements: [
                            {
                                title: 'Python',
                                imageLink: 'logos/python.png'
                            },
                            {
                                title: 'Java',
                                imageLink: 'logos/java.png'
                            },
                            {
                                title: 'NodeJS',
                                imageLink: 'logos/node.png'
                            },
                            {
                                title: 'C',
                                imageLink: 'logos/c.png'
                            }
                        ]
                    },
                    {
                        title: 'Frontend',
                        color: '#560bad',
                        elements: [
                            {
                                title: 'Angular',
                                imageLink: 'logos/angular.png'
                            },
                            {
                                title: 'CSS',
                                imageLink: 'logos/css.png'

                            },
                            {
                                title: 'Tailwind',
                                imageLink: 'logos/tailwind.png'
                            }
                        ]
                    },
                    {
                        title: 'IT',
                        color: '#560bad',
                        elements: [
                            {
                                title: 'Docker',
                                imageLink: 'logos/docker.png'
                            },
                            {
                                title: 'RabbitMQ',
                                imageLink: 'logos/rabbitmq.png'
                            },
                            {
                                title: 'Git',
                                imageLink: 'logos/git.png'
                            },
                            {
                                title: 'Redis',
                                imageLink: 'logos/redis.png'
                            }
                        ]
                    },
                    {
                        title: 'Tools',
                        color: '#560bad',
                    }
                ]
            },
            {
                title: 'Educational Background',
                color: '#560bad'
            },
            {
                title: 'Contact',
                color: '#560bad'
            }
        ]
    }
] as GraphContent[];