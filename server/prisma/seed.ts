import { sla } from "./seeds/sla";
import { rol } from "./seeds/rol";
import { evento } from "./seeds/evento";
import { etiquetas } from "./seeds/etiquetas";
import { especialidades } from "./seeds/especialidades";
import { estadoTicket } from "./seeds/estadoTicket";
import { prioridad } from "./seeds/prioridad";
import { disponibilidad } from "./seeds/disponibilidad";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();
const main = async () => {
  try {
    //Tablas sin relacion
    //Rol 
    await prisma.rol.createMany({
      data: rol,
    });

    await prisma.sLA.createMany({
      data: sla,
    });

    await prisma.evento.createMany({
      data: evento,
    });

    await prisma.etiqueta.createMany({
      data: etiquetas,
    });

    await prisma.especialidad.createMany({
      data: especialidades,
    });

    await prisma.estadoTicket.createMany({
      data: estadoTicket,
    });

    await prisma.prioridad.createMany({
      data: prioridad,
    });

    await prisma.estadoDisponibilidad.createMany({
      data: disponibilidad,
    });

    //Tablas relaciones incluidas
    //Categorias
    await prisma.categoria.create({
      data: {
        nombre: "Hardware Médico",
        slaId: 1,
        etiquetas: {
          connect: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }],
        },
        especialidades: {
          connect: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        },
      },
    });

    await prisma.categoria.create({
      data: {
        nombre: "Software Médico",
        slaId: 2,
        etiquetas: {
          connect: [{ id: 7 }, { id: 8 }, { id: 9 }, { id: 10 }],
        },
        especialidades: {
          connect: [{ id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }],
        },
      },
    });

    await prisma.categoria.create({
      data: {
        nombre: "Infraestructura TI",
        slaId: 3,
        etiquetas: {
          connect: [{ id: 11 }, { id: 12 }, { id: 13 }, { id: 14 }],
        },
        especialidades: {
          connect: [{ id: 9 }, { id: 10 }, { id: 11 }, { id: 12 }],
        },
      },
    });

    //Usuario - con relaciones incluidas
    //Usuario Admin
    //1
    await prisma.usuario.create({
      data: {
        correo: "natyescalantecastro@gmail.com",
        nombreCompleto: "Nataly Escalante Castro",
        ultimoLogin: new Date("2025-10-10"),
        rolId: 1,
        password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
      },
    });

    //3 Usuarios-Cliente
    //2
    await prisma.usuario.create({
      data: {
        correo: "fran@gmail.com",
        nombreCompleto: "Francisco Hernández",
        ultimoLogin: new Date("2025-10-10"),
        rolId: 2,
        password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
      },
    });
    //3
    await prisma.usuario.create({
      data: {
        correo: "maria@gmail.com",
        nombreCompleto: "Maria Mora",
        ultimoLogin: new Date("2025-10-10"),
        rolId: 2,
        password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
      },
    });
    //4
    await prisma.usuario.create({
      data: {
        correo: "leo@gmail.com",
        nombreCompleto: "Leonela Alfaro",
        ultimoLogin: new Date("2025-10-10"),
        rolId: 2,
        password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
      },
    });
    //5
    await prisma.usuario.create({
      data: {
        correo: "fio@gmail.com",
        nombreCompleto: "Fiorella Alfaro",
        ultimoLogin: new Date("2025-10-10"),
        rolId: 2,
        password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
      },
    });

    //4 Usuarios-Tecnicos
    //6
    await prisma.usuario.create({
      data: {
        correo: "maria.lopez@gmail.com",
        nombreCompleto: "María López Mora",
        ultimoLogin: new Date("2025-10-10"),
        rolId: 3,
        password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
        carga_Actual_Trabajo: 2,
        estado_DisponibilidadId: 1,
        especialidades: {
          connect: [{ id: 1 }, { id: 2 }],
        },
      },
    });
    //7
    await prisma.usuario.create({
      data: {
        correo: "juan.perez@gmail.com",
        nombreCompleto: "Juan Pérez",
        ultimoLogin: new Date("2025-10-10"),
        rolId: 3,
        password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
        carga_Actual_Trabajo: 1,
        estado_DisponibilidadId: 1,
        especialidades: {
          connect: [{ id: 5 }, { id: 6 }, { id: 8 }],
        },
      },
    });
    //8
    await prisma.usuario.create({
      data: {
        correo: "ana.martinez@gmail.com",
        nombreCompleto: "Ana Martínez",
        ultimoLogin: new Date("2025-10-10"),
        rolId: 3,
        password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
        carga_Actual_Trabajo: 1,
        estado_DisponibilidadId: 1,
        especialidades: {
          connect: [{ id: 9 }, { id: 10 }, { id: 11 }, { id: 12 }],
        },
      },
    });
    //9
    await prisma.usuario.create({
      data: {
        correo: "pedroalfaro@gmail.com",
        nombreCompleto: "Pedro Alfaro Castro",
        ultimoLogin: new Date("2025-10-10"),
        rolId: 3,
        password: "$2b$10$1BaQqXuZYNLDAC42PY5fN.ufSOKjApmjkaZrQUYf7ms71PaS1mASO",
        carga_Actual_Trabajo: 2,
        estado_DisponibilidadId: 2,/*Ocupado*/
        especialidades: {
          connect: [{ id: 3 }, { id: 4 }],
        },
      },
    });
    //tickets
    //1
    await prisma.ticket.create({
      data: {
        titulo: "El VENTILADOR de la UCI emite una alarma continua",
        descripcion: "El ventilador médico en la unidad de cuidados intensivos está emitiendo una alarma sonora continua que no cesa. El equipo presenta un pitido constante que indica una posible falla en el sistema. Se requiere atención inmediata ya que el equipo es crítico para el soporte vital de los pacientes en la UCI.",
        usuarioId: 2,
        categoriaId: 1,
        estadoId: 3,
        prioridadId: 3,
        createdAt: new Date("2025-10-17T14:00:00Z"), // Creado hace 30 minutos
      },
    });
    //2
    await prisma.ticket.create({
      data: {
        titulo: "Falla en equipo de TOMÓGRAFO en radiología",
        descripcion: "El tomógrafo Phillips Brilliance CT 64-slice presenta error de hardware durante los estudios. El equipo muestra código de error y se detiene abruptamente en medio de los procedimientos. No es posible realizar tomografías de emergencia, incluyendo estudios cerebrales y torácicos para pacientes críticos.",
        usuarioId: 2,
        categoriaId: 1,
        estadoId: 5,
        prioridadId: 3,
        createdAt: new Date("2025-10-17T08:00:00Z"), 
        fechaCierre: new Date("2025-10-17T12:30:00Z")
      },
    });
    //3
    await prisma.ticket.create({
      data: {
        titulo: "Falla en Mamógrafo Digital",
        descripcion: "El equipo Hologic Selenia Dimensions presenta error de compresión automática. El sistema no aplica la presión adecuada durante los estudios, imposibilitando la realización de mamografías de screening y diagnósticas. Esto afecta principalmente a pacientes con sospecha de cáncer de mama.",
        usuarioId: 2,
        categoriaId: 1,
        estadoId: 2,
        prioridadId: 3,
        createdAt: new Date("2025-10-17T13:00:00Z"),
      },
    });
    //4
    await prisma.ticket.create({
      data: {
        titulo: "Monitor cardiaco en cirugía deja de funcionar",
        descripcion: "Monitor cardíaco Phillips modelo MX450 en quirófano 3 presenta falla total del sistema. Equipo se apagó repentinamente sin previo aviso durante cirugía programada. No responde a intentos de reinicio, no enciende pantalla y no proporciona monitoreo de signos vitales. Situación de máxima urgencia por riesgo paciente.",
        usuarioId: 3,
        categoriaId: 1,
        estadoId: 3,
        prioridadId: 3,
        createdAt: new Date("2025-10-17T11:00:00Z"), // Creado a las 11:00 AM
      },
    });
    //5
    await prisma.ticket.create({
      data: {
        titulo: "Problema con software de farmacia",
        descripcion: "Sistema de farmacia no permite validar recetas médicas digitales. Al escanear los códigos QR, la aplicación arroja error de conexión con la base de datos. No se puede verificar la autenticidad de las recetas controladas.",
        usuarioId: 4,
        categoriaId: 2,
        estadoId: 2,
        prioridadId: 2,
        createdAt: new Date("2025-10-17T15:00:00Z"),
      },
    });
    //6
    await prisma.ticket.create({
      data: {
        titulo: "Personal nuevo no sabe usar módulo de enfermería",
        descripcion: "El personal de enfermería recién incorporado presenta dificultades para utilizar el módulo de registro de signos vitales y administración de medicamentos. No pueden navegar correctamente por la interfaz, registrar procedimientos ni generar reportes de turno. Se requiere capacitación urgente para garantizar el correcto registro de la atención al paciente.",
        usuarioId: 5,
        categoriaId: 2,
        estadoId: 2,
        prioridadId: 3,
        createdAt: new Date("2025-10-17T12:00:00Z"),
      },
    });
    //7
    await prisma.ticket.create({
      data: {
        titulo: "La impresora de recetas no funciona",
        descripcion: "La impresora de recetas médicas no funciona, imposibilitando la generación de prescripciones para los pacientes.",
        usuarioId: 3,
        categoriaId: 3,
        estadoId: 5,
        prioridadId: 1,
        createdAt: new Date("2025-10-17T08:00:00Z"),
        fechaCierre: new Date("2025-10-17T11:20:00Z")
      },
    });
    //8
    await prisma.ticket.create({
      data: {
        titulo: "No hay internet en todo el piso de urgencias",
        descripcion: "FALLA CRÍTICA: Ausencia total de conexión a internet en todo el departamento de urgencias. Esto afecta sistemas vitales como: historiales clínicos electrónicos, monitoreo de pacientes, comunicación con laboratorio y farmacia, y acceso a protocolos médicos.",
        usuarioId: 3,
        categoriaId: 3,
        estadoId: 5,
        prioridadId: 3,
        createdAt: new Date("2025-10-17T08:00:00Z"),
        fechaCierre: new Date("2025-10-17T14:00:00Z")
      },
    });

    //Historias de los tickets 
    //historia 1 del ticket 1
    //1
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 1,
        estado_AnteriorId: 1,
        updatedAt: new Date("2025-10-17T14:00:00Z")
      }
    });
    //2
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 1,
        estado_AnteriorId: 2,
        updatedAt: new Date("2025-10-17T14:15:00Z")
      }
    });
    //3
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 1,
        estado_AnteriorId: 3,
        updatedAt: new Date("2025-10-17T14:30:00Z")
      }
    });
    //historia 2 del ticket 2
    //4
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 2,
        estado_AnteriorId: 1,
        updatedAt: new Date("2025-10-17T08:00:00Z")
      }
    });
    //5
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 2,
        estado_AnteriorId: 2,
        updatedAt: new Date("2025-10-17T08:10:00Z")
      }
    });
    //6
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 2,
        estado_AnteriorId: 3,
        updatedAt: new Date("2025-10-17T09:15:00Z")
      }
    });
    //7
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 2,
        estado_AnteriorId: 4,
        updatedAt: new Date("2025-10-17T12:20:00Z")
      }
    });
    //8
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 2,
        estado_AnteriorId: 5,
        updatedAt: new Date("2025-10-17T12:30:00Z")
      }
    });
    //historia 3 del ticket 3
    //9
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 3,
        estado_AnteriorId: 1,
        updatedAt: new Date("2025-10-17T13:00:00Z")
      }
    });
    //10
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 3,
        estado_AnteriorId: 2,
        updatedAt: new Date("2025-10-17T13:30:00Z")
      }
    });
    //historia 4 del ticket 4
    //11
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 4,
        estado_AnteriorId: 1,
        updatedAt: new Date("2025-10-17T11:00:00Z")
      }
    });
    //12
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 4,
        estado_AnteriorId: 2,
        updatedAt: new Date("2025-10-17T12:30:00Z") // Asignado en 1.5 horas (TARDÍO - SLA: 1 hora)
      }
    });
    //13
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 4,
        estado_AnteriorId: 3,
        updatedAt: new Date("2025-10-17T13:00:00Z")
      }
    });
    //historia 5 del ticket 5
    //14
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 5,
        estado_AnteriorId: 1,
        updatedAt: new Date("2025-10-17T15:00:00Z")
      }
    });
    //15
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 5,
        estado_AnteriorId: 2,
        updatedAt: new Date("2025-10-17T15:15:00Z") // Asignado en 15 min (Dentro de 30 min)
      }
    });
    //historia 6 del ticket 6
    //16
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 6,
        estado_AnteriorId: 1,
        updatedAt: new Date("2025-10-17T12:00:00Z")
      }
    });
    //17
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 6,
        estado_AnteriorId: 2,
        updatedAt: new Date("2025-10-17T12:20:00Z")
      }
    });
    //historia 7 del ticket 7
    //18
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 7,
        estado_AnteriorId: 1,
        updatedAt: new Date("2025-10-17T08:00:00Z")
      }
    });
    //19
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 7,
        estado_AnteriorId: 2,
        updatedAt: new Date("2025-10-17T09:00:00Z")
      }
    });
    //20
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 7,
        estado_AnteriorId: 3,
        updatedAt: new Date("2025-10-17T09:30:00Z")
      }
    });
    //21
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 7,
        estado_AnteriorId: 4,
        updatedAt: new Date("2025-10-17T11:00:00Z")
      }
    });
    //22
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 7,
        estado_AnteriorId: 5,
        updatedAt: new Date("2025-10-17T11:20:00Z")
      }
    });
    //historia 8 del ticket 8
    //23
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 8,
        estado_AnteriorId: 1,
        updatedAt: new Date("2025-10-17T08:00:00Z")
      }
    });
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 8,
        estado_AnteriorId: 2,
        updatedAt: new Date("2025-10-17T10:45:00Z")
      }
    });
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 8,
        estado_AnteriorId: 3,
        updatedAt: new Date("2025-10-17T11:10:00Z")
      }
    });
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 8,
        estado_AnteriorId: 4,
        updatedAt: new Date("2025-10-17T14:00:00Z")
      }
    });
    await prisma.ticketHistorial.create({
      data: {
        ticketId: 8,
        estado_AnteriorId: 5,
        updatedAt: new Date("2025-10-17T14:00:00Z")
      }
    });
    //imagen de la historia 1
    await prisma.ticketImagen.create({
      data: {
        ticketHId: 1,
        ruta: "ticket_1_1.jpg",
      },
    });
    await prisma.ticketImagen.create({
      data: {
        ticketHId: 1,
        ruta: "ticket_1_2.jpg",
      },
    });
    await prisma.ticketImagen.create({
      data: {
        ticketHId: 3,
        ruta: "ticket_1_3.png",
      },
    });
    //imagenes de la historia 2
    await prisma.ticketImagen.create({
      data: {
        ticketHId: 4,
        ruta: "ticket_2_1.jpg",
      },
    });
    await prisma.ticketImagen.create({
      data: {
        ticketHId: 4,
        ruta: "ticket_2_2.jpg",
      },
    });
    await prisma.ticketImagen.create({
      data: {
        ticketHId: 6,
        ruta: "ticket_2_3.jpg",
      },
    });
    //imagenes de la historia 3
    await prisma.ticketImagen.create({
      data: {
        ticketHId: 9,
        ruta: "ticket_3_1.jpg",
      },
    });
    await prisma.ticketImagen.create({
      data: {
        ticketHId: 9,
        ruta: "ticket_3_2.jpg",
      },
    });
    //imagenes de la historia 4
    await prisma.ticketImagen.create({
      data: {
        ticketHId: 11,
        ruta: "ticket_4_1.png",
      },
    });
    await prisma.ticketImagen.create({
      data: {
        ticketHId: 13,
        ruta: "ticket_4_3.png",
      },
    });
    await prisma.ticketImagen.create({
      data: {
        ticketHId: 13,
        ruta: "ticket_4_2.jpg",
      },
    });
    //imagenes de la historia 5
    await prisma.ticketImagen.create({
      data: {
        ticketHId: 14,
        ruta: "ticket_5_1.png",
      },
    });
    await prisma.ticketImagen.create({
      data: {
        ticketHId: 14,
        ruta: "ticket_5_2.png",
      },
    });
    //imagenes de la historia 6
    await prisma.ticketImagen.create({
      data: {
        ticketHId: 16,
        ruta: "ticket_6_2.png",
      },
    });
    //imagenes de la historia 7
    await prisma.ticketImagen.create({
      data: {
        ticketHId: 18,
        ruta: "ticket_7_1.png",
      },
    });

    // Reglas de AutoTriage
    await prisma.reglasAutoTriage.createMany({
      data: [
        // REGLA 1 
        {
          nombre: "R1 - Hardware Médico Crítico",
          categoriaId: 1,
          prioridadId: 3,
          especialidadId: 1,
          cargaMaximaTecnico: 3,
          ordenPrioridad: 1,
          puntaje: 3000.00
        },

        // REGLA 2 
        {
          nombre: "R2 - Hardware Mantenimiento",
          categoriaId: 1,
          especialidadId: 3,
          cargaMaximaTecnico: 4,
          ordenPrioridad: 2,
          puntaje: 2000.00
        },

        // REGLA 3 
        {
          nombre: "R3 - Software Médico Crítico",
          categoriaId: 2,
          prioridadId: 3,
          especialidadId: 5,
          cargaMaximaTecnico: 4,
          ordenPrioridad: 3,
          puntaje: 2800.00
        },

        // REGLA 4 
        {
          nombre: "R4 - Software Médico Usuario",
          categoriaId: 2,
          especialidadId: 8,
          cargaMaximaTecnico: 5,
          ordenPrioridad: 4,
          puntaje: 1500.00
        },

        // REGLA 5 
        {
          nombre: "R5 - Infraestructura Crítica",
          categoriaId: 3,
          prioridadId: 3,
          especialidadId: 10,
          cargaMaximaTecnico: 3,
          ordenPrioridad: 5,
          puntaje: 2900.00
        },

        // REGLA 6 
        {
          nombre: "R6 - Soporte TI General",
          categoriaId: 3,
          especialidadId: 9,
          cargaMaximaTecnico: 5,
          ordenPrioridad: 6,
          puntaje: 1200.00
        },

        // REGLA 7 
        {
          nombre: "R7 - Especialidad Radiología",
          categoriaId: 1, 
          especialidadId: 4,
          cargaMaximaTecnico: 4,
          ordenPrioridad: 7,
          puntaje: 1800.00
        },

        // REGLA 8 
        {
          nombre: "R8 - Sistemas y Base de Datos",
          categoriaId: 2,
          especialidadId: 6,
          cargaMaximaTecnico: 4,
          ordenPrioridad: 8,
          puntaje: 1600.00
        },

        // REGLA 9
        {
          nombre: "R9 - Help Desk Universal",
          categoriaId: 3,
          especialidadId: 12,
          cargaMaximaTecnico: 8,
          ordenPrioridad: 9,
          puntaje: 500.00
        }
      ]
    });

    // asignaciones
    await prisma.asignacion.createMany({
      data: [
        {
          metodo: "Automática",
          reglaId: 1,
          ticketId: 1,
          usuarioId: 6,
          observaciones: "Asignado por regla R1 - Hardware Médico Crítico."
        },

        {
          metodo: "Automática",
          reglaId: 7,
          ticketId: 2,
          usuarioId: 9,
          observaciones: "Asignado por regla R7 - Especialidad Radiología."
        },

        {
          metodo: "Automática",
          reglaId: 7,
          ticketId: 3,
          usuarioId: 9,
          observaciones: "Asignado por regla R7 - Especialidad Radiología."
        },

        {
          metodo: "Automática",
          reglaId: 1,
          ticketId: 4,
          usuarioId: 6,
          observaciones: "Asignado por regla R1 - Hardware Médico Crítico"
        },
        {
          metodo: "Automática",
          reglaId: 3,
          ticketId: 5,
          usuarioId: 7,
          observaciones: "Asignación por regla R3 - Software Médico Crítico. "
        },
        {
          metodo: "Automática",
          reglaId: 4,
          ticketId: 6,
          usuarioId: 7,
          observaciones: "Asignación por regla R4 - Software Médico Usuario. "
        },
        {
          metodo: "Manual",
          ticketId: 7,
          usuarioId: 8,
          observaciones: "Asignación manual por administrador. Falla impresora de recetas médicas."
        },
        {
          metodo: "Manual",
          ticketId: 8,
          usuarioId: 8,
          observaciones: "Asignación manual por administrador. Falla crítica en red de urgencias."
        }
      ]
    });
    //Valoracion
    await prisma.valoracion.create({
      data: {
        ticketId: 7,
        valoracion: 5,
        comentario: "¡Excelente servicio! El técnico resolvió el problema rápidamente. La impresora quedó funcionando perfectamente y pudimos retomar la emisión de recetas médicas sin demoras. Muy profesional."
      }
    });
    await prisma.valoracion.create({
      data: {
        ticketId: 8,
        valoracion: 4,
        comentario: "¡Buen servicio! El técnico resolvió el problema rápidamente. La hora de respuesta estimada es de 2 horas y se tardó 45 minutos de respuesta, fue mucho pero el técnico terminó a tiempo eso recompensa."
      }
    });
    await prisma.valoracion.create({
      data: {
        ticketId: 2,
        valoracion: 5,
        comentario: "Se solucionó el problema, una máquina importante y fundamental para la toma de imágenes",
      }
    });
  } catch (error) {
    throw error;
  }
};

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
  })

