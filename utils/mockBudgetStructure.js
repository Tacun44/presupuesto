const mockBudgetStructure = [
    {
        id: '1',
        code: '1',
        name: 'INGRESOS',
        type: 'group',
        classification: 'ingresos',
        description: 'Ingresos totales de la E.S.E.',
        children: [
            {
                id: '1.1',
                code: '1.1',
                name: 'INGRESOS CORRIENTES',
                type: 'group',
                classification: 'ingresos',
                description: 'Ingresos por prestación de servicios y otros',
                children: [
                    {
                        id: '1.1.1',
                        code: '1.1.1',
                        name: 'VENTA DE SERVICIOS DE SALUD',
                        type: 'group',
                        classification: 'ingresos',
                        description: 'Ingresos por servicios prestados',
                        children: [
                            {
                                id: '1.1.1.01',
                                code: '1.1.1.01',
                                name: 'EPS RÉGIMEN CONTRIBUTIVO',
                                type: 'movement',
                                classification: 'ingresos',
                                description: 'Servicios prestados a EPS del régimen contributivo',
                                children: []
                            },
                            {
                                id: '1.1.1.02',
                                code: '1.1.1.02',
                                name: 'EPS RÉGIMEN SUBSIDIADO',
                                type: 'movement',
                                classification: 'ingresos',
                                description: 'Servicios prestados a EPS del régimen subsidiado',
                                children: []
                            },
                            {
                                id: '1.1.1.03',
                                code: '1.1.1.03',
                                name: 'POBLACIÓN POBRE NO ASEGURADA',
                                type: 'movement',
                                classification: 'ingresos',
                                description: 'Servicios prestados a población vinculada',
                                children: []
                            },
                            {
                                id: '1.1.1.04',
                                code: '1.1.1.04',
                                name: 'PLAN DE INTERVENCIONES COLECTIVAS',
                                type: 'movement',
                                classification: 'ingresos',
                                description: 'Ingresos por ejecución del PIC',
                                children: []
                            },
                            {
                                id: '1.1.1.05',
                                code: '1.1.1.05',
                                name: 'OTRAS VENTAS DE SERVICIOS',
                                type: 'movement',
                                classification: 'ingresos',
                                description: 'SOAT, ARL, particulares y otros',
                                children: []
                            }
                        ]
                    }
                ]
            },
            {
                id: '1.2',
                code: '1.2',
                name: 'TRANSFERENCIAS Y APORTES',
                type: 'group',
                classification: 'ingresos',
                description: 'Ingresos por transferencias y aportes',
                children: [
                    {
                        id: '1.2.1',
                        code: '1.2.1',
                        name: 'TRANSFERENCIAS DEL ORDEN NACIONAL',
                        type: 'movement',
                        classification: 'ingresos',
                        description: 'Aportes de la nación',
                        children: []
                    },
                    {
                        id: '1.2.2',
                        code: '1.2.2',
                        name: 'TRANSFERENCIAS DEPARTAMENTALES',
                        type: 'movement',
                        classification: 'ingresos',
                        description: 'Aportes del departamento',
                        children: []
                    },
                    {
                        id: '1.2.3',
                        code: '1.2.3',
                        name: 'TRANSFERENCIAS MUNICIPALES',
                        type: 'movement',
                        classification: 'ingresos',
                        description: 'Aportes del municipio',
                        children: []
                    }
                ]
            },
            {
                id: '1.3',
                code: '1.3',
                name: 'RECURSOS DE CAPITAL',
                type: 'group',
                classification: 'ingresos',
                description: 'Recursos de capital y otros',
                children: [
                    {
                        id: '1.3.1',
                        code: '1.3.1',
                        name: 'RENDIMIENTOS FINANCIEROS',
                        type: 'movement',
                        classification: 'ingresos',
                        description: 'Intereses y rendimientos',
                        children: []
                    },
                    {
                        id: '1.3.2',
                        code: '1.3.2',
                        name: 'RECUPERACIÓN DE CARTERA',
                        type: 'movement',
                        classification: 'ingresos',
                        description: 'Recuperación de cartera de vigencias anteriores',
                        children: []
                    }
                ]
            }
        ]
    },
    {
        id: '2',
        code: '2',
        name: 'GASTOS',
        type: 'group',
        classification: 'funcionamiento',
        description: 'Gastos totales de la E.S.E.',
        children: [
            {
                id: '2.1',
                code: '2.1',
                name: 'GASTOS DE FUNCIONAMIENTO',
                type: 'group',
                classification: 'funcionamiento',
                description: 'Gastos de funcionamiento de la entidad',
                children: [
                    {
                        id: '2.1.1',
                        code: '2.1.1',
                        name: 'GASTOS DE PERSONAL',
                        type: 'group',
                        classification: 'funcionamiento',
                        description: 'Gastos asociados a la nómina y personal',
                        children: [
                            {
                                id: '2.1.1.01',
                                code: '2.1.1.01',
                                name: 'PLANTA DE PERSONAL PERMANENTE',
                                type: 'group',
                                classification: 'funcionamiento',
                                description: 'Personal de planta de la entidad',
                                children: [
                                    {
                                        id: '2.1.1.01.01',
                                        code: '2.1.1.01.01',
                                        name: 'SALARIO',
                                        type: 'movement',
                                        classification: 'funcionamiento',
                                        description: 'Salario básico del personal de planta',
                                        children: []
                                    },
                                    {
                                        id: '2.1.1.01.02',
                                        code: '2.1.1.01.02',
                                        name: 'CONTRIBUCIONES INHERENTES A LA NÓMINA',
                                        type: 'movement',
                                        classification: 'funcionamiento',
                                        description: 'Aportes parafiscales y seguridad social',
                                        children: []
                                    }
                                ]
                            },
                            {
                                id: '2.1.1.02',
                                code: '2.1.1.02',
                                name: 'PERSONAL SUPERNUMERARIO Y TEMPORAL',
                                type: 'movement',
                                classification: 'funcionamiento',
                                description: 'Personal temporal y supernumerario',
                                children: []
                            }
                        ]
                    },
                    {
                        id: '2.1.2',
                        code: '2.1.2',
                        name: 'ADQUISICIÓN DE BIENES Y SERVICIOS',
                        type: 'group',
                        classification: 'funcionamiento',
                        description: 'Gastos de adquisición de bienes y servicios',
                        children: [
                            {
                                id: '2.1.2.01',
                                code: '2.1.2.01',
                                name: 'MEDICAMENTOS E INSUMOS HOSPITALARIOS',
                                type: 'movement',
                                classification: 'funcionamiento',
                                description: 'Adquisición de medicamentos e insumos médicos',
                                children: []
                            },
                            {
                                id: '2.1.2.02',
                                code: '2.1.2.02',
                                name: 'MATERIALES Y SUMINISTROS',
                                type: 'movement',
                                classification: 'funcionamiento',
                                description: 'Materiales y suministros generales',
                                children: []
                            },
                            {
                                id: '2.1.2.03',
                                code: '2.1.2.03',
                                name: 'SERVICIOS PÚBLICOS',
                                type: 'movement',
                                classification: 'funcionamiento',
                                description: 'Servicios públicos de la entidad',
                                children: []
                            }
                        ]
                    }
                ]
            },
            {
                id: '2.3',
                code: '2.3',
                name: 'GASTOS DE INVERSIÓN',
                type: 'group',
                classification: 'inversion',
                description: 'Gastos de inversión de la entidad',
                children: [
                    {
                        id: '2.3.1',
                        code: '2.3.1',
                        name: 'INFRAESTRUCTURA',
                        type: 'group',
                        classification: 'inversion',
                        description: 'Inversión en infraestructura hospitalaria',
                        children: [
                            {
                                id: '2.3.1.01',
                                code: '2.3.1.01',
                                name: 'CONSTRUCCIÓN NUEVA INFRAESTRUCTURA',
                                type: 'movement',
                                classification: 'inversion',
                                description: 'Construcción de nuevas edificaciones',
                                children: []
                            },
                            {
                                id: '2.3.1.02',
                                code: '2.3.1.02',
                                name: 'AMPLIACIÓN DE SERVICIOS',
                                type: 'movement',
                                classification: 'inversion',
                                description: 'Ampliación de áreas de servicio existentes',
                                children: []
                            },
                            {
                                id: '2.3.1.03',
                                code: '2.3.1.03',
                                name: 'MANTENIMIENTO INFRAESTRUCTURA',
                                type: 'movement',
                                classification: 'inversion',
                                description: 'Mantenimiento y mejoras de infraestructura',
                                children: []
                            }
                        ]
                    },
                    {
                        id: '2.3.2',
                        code: '2.3.2',
                        name: 'DOTACIÓN Y EQUIPAMIENTO',
                        type: 'group',
                        classification: 'inversion',
                        description: 'Inversión en equipamiento hospitalario',
                        children: [
                            {
                                id: '2.3.2.01',
                                code: '2.3.2.01',
                                name: 'EQUIPO MÉDICO ESPECIALIZADO',
                                type: 'movement',
                                classification: 'inversion',
                                description: 'Equipos médicos de alta complejidad',
                                children: []
                            },
                            {
                                id: '2.3.2.02',
                                code: '2.3.2.02',
                                name: 'EQUIPO MÉDICO BÁSICO',
                                type: 'movement',
                                classification: 'inversion',
                                description: 'Equipos médicos de baja y mediana complejidad',
                                children: []
                            },
                            {
                                id: '2.3.2.03',
                                code: '2.3.2.03',
                                name: 'MOBILIARIO HOSPITALARIO',
                                type: 'movement',
                                classification: 'inversion',
                                description: 'Mobiliario específico para servicios de salud',
                                children: []
                            },
                            {
                                id: '2.3.2.04',
                                code: '2.3.2.04',
                                name: 'EQUIPOS DE CÓMPUTO Y COMUNICACIÓN',
                                type: 'movement',
                                classification: 'inversion',
                                description: 'Infraestructura tecnológica y comunicaciones',
                                children: []
                            }
                        ]
                    },
                    {
                        id: '2.3.3',
                        code: '2.3.3',
                        name: 'DESARROLLO INSTITUCIONAL',
                        type: 'group',
                        classification: 'inversion',
                        description: 'Inversión en desarrollo institucional',
                        children: [
                            {
                                id: '2.3.3.01',
                                code: '2.3.3.01',
                                name: 'SISTEMAS DE INFORMACIÓN',
                                type: 'movement',
                                classification: 'inversion',
                                description: 'Software y sistemas de información hospitalaria',
                                children: []
                            },
                            {
                                id: '2.3.3.02',
                                code: '2.3.3.02',
                                name: 'ACREDITACIÓN Y CALIDAD',
                                type: 'movement',
                                classification: 'inversion',
                                description: 'Procesos de acreditación y mejora de calidad',
                                children: []
                            },
                            {
                                id: '2.3.3.03',
                                code: '2.3.3.03',
                                name: 'CAPACITACIÓN Y DESARROLLO',
                                type: 'movement',
                                classification: 'inversion',
                                description: 'Formación y desarrollo del personal',
                                children: []
                            }
                        ]
                    },
                    {
                        id: '2.3.4',
                        code: '2.3.4',
                        name: 'PROYECTOS ESPECIALES',
                        type: 'group',
                        classification: 'inversion',
                        description: 'Proyectos específicos de la región',
                        children: [
                            {
                                id: '2.3.4.01',
                                code: '2.3.4.01',
                                name: 'TELEMEDICINA',
                                type: 'movement',
                                classification: 'inversion',
                                description: 'Implementación de servicios de telemedicina',
                                children: []
                            },
                            {
                                id: '2.3.4.02',
                                code: '2.3.4.02',
                                name: 'ATENCIÓN A COMUNIDADES INDÍGENAS',
                                type: 'movement',
                                classification: 'inversion',
                                description: 'Programas específicos para comunidades indígenas',
                                children: []
                            },
                            {
                                id: '2.3.4.03',
                                code: '2.3.4.03',
                                name: 'BRIGADAS DE SALUD',
                                type: 'movement',
                                classification: 'inversion',
                                description: 'Brigadas de salud en zonas rurales',
                                children: []
                            }
                        ]
                    }
                ]
            },
            {
                id: '2.4',
                code: '2.4',
                name: 'SERVICIO DE LA DEUDA',
                type: 'group',
                classification: 'deuda',
                description: 'Servicio de la deuda pública',
                children: [
                    {
                        id: '2.4.1',
                        code: '2.4.1',
                        name: 'DEUDA INTERNA',
                        type: 'movement',
                        classification: 'deuda',
                        description: 'Servicio de la deuda interna',
                        children: []
                    },
                    {
                        id: '2.4.2',
                        code: '2.4.2',
                        name: 'DEUDA EXTERNA',
                        type: 'movement',
                        classification: 'deuda',
                        description: 'Servicio de la deuda externa',
                        children: []
                    }
                ]
            }
        ]
    }
];
