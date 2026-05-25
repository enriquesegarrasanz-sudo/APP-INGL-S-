import type { ConversationScenario, ConversationTool } from '../types/conversation';

export const CONVERSATION_SCENARIOS: ConversationScenario[] = [
  {
    id: 'social-event',
    title: 'Social Event',
    title_es: 'Evento social',
    description_es: 'Fiesta, cena con amigos, quedada informal — conoces a alguien nuevo en un contexto relajado.',
    context_es: 'El ambiente es distendido, el tono casual. No hay presion profesional, pero quieres causar buena impresion y conectar.',
    color: '#7C5CFC',
    phases: [
      {
        id: 'social-opening',
        name: 'Breaking the Ice',
        name_es: 'Romper el hielo',
        description_es: 'Los primeros segundos. Saludar, presentarte, encontrar el hilo comun que os conecta al evento.',
        exchanges: [
          {
            id: 'se-1',
            question: { en: "Hey, how's it going?", es: 'Ey, ¿que tal?' },
            answers: [
              { en: "Good, thanks! How about you?", es: '¡Bien, gracias! ¿Y tu?' },
              { en: "Pretty good! Great party, right?", es: '¡Bastante bien! Buena fiesta, ¿no?', context_es: 'Si es una fiesta o evento animado' },
            ],
            tip_es: '"How\'s it going" es mas natural que "How are you" en contextos informales. La respuesta no necesita ser profunda — es un ritual social.',
            register: 'casual',
          },
          {
            id: 'se-2',
            question: { en: "Hi, I'm [name]. Nice to meet you.", es: 'Hola, soy [nombre]. Encantado.' },
            answers: [
              { en: "Nice to meet you too! I'm Enrike.", es: '¡Encantado tambien! Soy Enrike.' },
              { en: "Hey! Good to meet you. I'm Enrike.", es: '¡Ey! Encantado. Soy Enrike.', context_es: 'Tono mas informal' },
            ],
            tip_es: 'En ingles no se dice "encantado de conocerte" de manera tan formal como en espanol. "Nice to meet you" es suficiente. "Good to meet you" es aun mas casual.',
            register: 'casual',
          },
          {
            id: 'se-3',
            question: { en: "How do you know [host/person]?", es: '¿De que conoces a [anfitrion/persona]?' },
            answers: [
              { en: "We met through work a couple of years ago.", es: 'Nos conocimos por trabajo hace un par de anos.' },
              { en: "A friend introduced us. What about you?", es: 'Nos presento un amigo. ¿Y tu?', context_es: 'Devolver la pregunta mantiene la conversacion' },
              { en: "We go way back, actually.", es: 'Nos conocemos desde hace mucho, la verdad.', context_es: 'Si os conoceis de toda la vida' },
            ],
            tip_es: 'Esta es LA pregunta mas comun en eventos sociales. Siempre ten una respuesta preparada. Terminar con "What about you?" es clave para no dejar la conversacion muerta.',
            register: 'casual',
          },
          {
            id: 'se-4',
            question: { en: "Is this your first time here?", es: '¿Es tu primera vez aqui?' },
            answers: [
              { en: "Yeah, first time! It's a great spot.", es: '¡Si, primera vez! Es un sitio genial.' },
              { en: "No, I've been here a few times. It never disappoints.", es: 'No, he venido varias veces. Nunca decepciona.' },
            ],
            register: 'casual',
          },
        ],
      },
      {
        id: 'social-discovery',
        name: 'Getting to Know Each Other',
        name_es: 'Descubrirse',
        description_es: 'Las preguntas basicas: a que te dedicas, de donde eres, que haces. El nucleo de toda primera conversacion.',
        exchanges: [
          {
            id: 'se-5',
            question: { en: "So, what do you do?", es: 'Y, ¿a que te dedicas?' },
            answers: [
              { en: "I'm a filmmaker. I direct and produce independent projects.", es: 'Soy cineasta. Dirijo y produzco proyectos independientes.' },
              { en: "I work in film, and I also build apps using AI.", es: 'Trabajo en cine y tambien desarrollo apps usando IA.', context_es: 'Si quieres mostrar tu perfil completo' },
              { en: "A bit of everything, honestly — film, tech, creative stuff.", es: 'Un poco de todo, la verdad: cine, tecnologia, cosas creativas.', context_es: 'Respuesta mas casual y abierta' },
            ],
            tip_es: 'En ingles "What do you do?" es la pregunta universal. No digas "I dedicate myself to..." — suena muy literal del espanol. Usa "I\'m a..." o "I work in...".',
            register: 'casual',
          },
          {
            id: 'se-6',
            question: { en: "Where are you from?", es: '¿De donde eres?' },
            answers: [
              { en: "I'm from Madrid.", es: 'Soy de Madrid.' },
              { en: "I'm from Spain, based in Madrid.", es: 'Soy de Espana, vivo en Madrid.', context_es: 'Si hablas con extranjeros' },
              { en: "Originally from Madrid, born and raised.", es: 'De Madrid de toda la vida.', context_es: 'Tono coloquial' },
            ],
            register: 'casual',
          },
          {
            id: 'se-7',
            question: { en: "What kind of films do you make?", es: '¿Que tipo de peliculas haces?' },
            answers: [
              { en: "Mostly short films, but I'm working on my first feature.", es: 'Sobre todo cortometrajes, pero estoy trabajando en mi primer largo.' },
              { en: "Independent stuff — a mix of fiction and documentary.", es: 'Cosas independientes: mezcla de ficcion y documental.' },
            ],
            register: 'casual',
          },
          {
            id: 'se-8',
            question: { en: "How long have you been doing this?", es: '¿Cuanto tiempo llevas con esto?' },
            answers: [
              { en: "About ten years now.", es: 'Unos diez anos ya.' },
              { en: "I've been in the industry for a while.", es: 'Llevo un tiempo en la industria.' },
              { en: "Since college, basically. It's been a journey.", es: 'Desde la universidad, basicamente. Ha sido todo un camino.', context_es: 'Respuesta con mas peso emocional' },
            ],
            tip_es: '"How long have you been doing this?" usa present perfect continuous — la respuesta natural es "About X years" o "Since [momento]". No digas "I carry ten years" (llevo diez anos).',
            register: 'casual',
          },
          {
            id: 'se-9',
            question: { en: "What do you do in your free time?", es: '¿Que haces en tu tiempo libre?' },
            answers: [
              { en: "I'm really into photography and hiking.", es: 'Me va mucho la fotografia y el senderismo.' },
              { en: "Honestly, I spend a lot of time experimenting with AI tools.", es: 'Honestamente, paso mucho tiempo experimentando con herramientas de IA.' },
              { en: "I read a lot and I'm getting into coding.", es: 'Leo mucho y me estoy metiendo en programacion.' },
            ],
            tip_es: '"I\'m really into..." es la forma mas natural de decir "me gusta mucho" o "me va mucho". Mucho mejor que "I like a lot...".',
            register: 'casual',
          },
        ],
      },
      {
        id: 'social-deepening',
        name: 'Going Deeper',
        name_es: 'Profundizar',
        description_es: 'La conversacion ya fluye. Preguntas mas personales, opiniones, compartir proyectos y motivaciones.',
        exchanges: [
          {
            id: 'se-10',
            question: { en: "What are you working on right now?", es: '¿En que estas trabajando ahora mismo?' },
            answers: [
              { en: "I'm developing a feature film and building a learning app on the side.", es: 'Estoy desarrollando un largometraje y de paso creando una app de aprendizaje.' },
              { en: "A few things, actually — a film project and some tech experiments.", es: 'Varias cosas, la verdad: un proyecto de cine y algunos experimentos tech.' },
            ],
            register: 'casual',
          },
          {
            id: 'se-11',
            question: { en: "What got you into filmmaking?", es: '¿Como empezaste en el cine?' },
            answers: [
              { en: "I've always been drawn to visual storytelling.", es: 'Siempre me ha atraido la narrativa visual.' },
              { en: "I started making short films in college and never stopped.", es: 'Empece haciendo cortos en la universidad y nunca pare.' },
              { en: "It kind of found me, honestly. I was into photography first.", es: 'Llego a mi, la verdad. Primero estaba en la fotografia.', context_es: 'Tono mas reflexivo' },
            ],
            tip_es: '"What got you into X?" es muy natural. No digas "How you started in..." — suena raro. Y la respuesta "I\'ve always been drawn to..." es elegante y muy usada.',
            register: 'casual',
          },
          {
            id: 'se-12',
            question: { en: "Have you seen [movie/show]?", es: '¿Has visto [pelicula/serie]?' },
            answers: [
              { en: "Yeah, I loved it. The cinematography was stunning.", es: 'Si, me encanto. La fotografia era espectacular.' },
              { en: "Not yet, but it's on my list. Is it worth watching?", es: 'Aun no, pero lo tengo pendiente. ¿Merece la pena?' },
              { en: "I started it but didn't finish. Does it get better?", es: 'Lo empece pero no lo termine. ¿Mejora?' },
            ],
            register: 'casual',
          },
          {
            id: 'se-13',
            question: { en: "What do you think about [topic/trend]?", es: '¿Que opinas de [tema/tendencia]?' },
            answers: [
              { en: "I think it's really interesting, especially because...", es: 'Creo que es muy interesante, sobre todo porque...' },
              { en: "Honestly, I have mixed feelings about it.", es: 'Honestamente, tengo sentimientos encontrados.' },
              { en: "I'm still figuring that out, to be honest.", es: 'Todavia lo estoy procesando, para ser sincero.', context_es: 'Si no tienes opinion clara — es valido' },
            ],
            tip_es: '"I have mixed feelings" es mucho mas natural que "I have mixed opinions". Y "I\'m still figuring that out" es una gran frase para cuando no tienes opinion formada.',
            register: 'casual',
          },
          {
            id: 'se-14',
            question: { en: "Do you use AI in your work?", es: '¿Usas IA en tu trabajo?' },
            answers: [
              { en: "Yeah, quite a bit actually. I use it for coding and some creative work.", es: 'Si, bastante la verdad. La uso para programar y algo de trabajo creativo.' },
              { en: "More and more. It's become part of my workflow.", es: 'Cada vez mas. Se ha convertido en parte de mi flujo de trabajo.' },
            ],
            register: 'casual',
          },
        ],
      },
      {
        id: 'social-connecting',
        name: 'Building Connection',
        name_es: 'Construir conexion',
        description_es: 'Ya hay quimica. Es el momento de proponer un siguiente paso, intercambiar contacto, o simplemente reforzar la conexion.',
        exchanges: [
          {
            id: 'se-15',
            question: { en: "We should grab a coffee sometime.", es: 'Deberiamos tomar un cafe algun dia.' },
            answers: [
              { en: "Yeah, I'd love that. When are you free?", es: 'Si, me encantaria. ¿Cuando estas libre?' },
              { en: "For sure! Let me give you my number.", es: '¡Claro! Te doy mi numero.' },
            ],
            tip_es: '"We should grab a coffee" es la frase universal para proponer un siguiente encuentro. Es casual, sin compromiso, y funciona en casi cualquier contexto.',
            register: 'casual',
          },
          {
            id: 'se-16',
            question: { en: "Are you on Instagram?", es: '¿Estas en Instagram?' },
            answers: [
              { en: "Yeah, look me up — it's @[handle].", es: 'Si, buscame: es @[usuario].' },
              { en: "I am, but I'm more active on LinkedIn for work stuff.", es: 'Si, pero para cosas de trabajo soy mas activo en LinkedIn.', context_es: 'Si prefieres mantener lo profesional' },
            ],
            register: 'casual',
          },
          {
            id: 'se-17',
            question: { en: "I'd love to see some of your work.", es: 'Me encantaria ver algo de tu trabajo.' },
            answers: [
              { en: "Sure! I'll send you a link to my reel.", es: '¡Claro! Te paso un enlace a mi videobook.' },
              { en: "I'd appreciate that. Here's my website.", es: 'Te lo agradezco. Aqui esta mi web.' },
            ],
            register: 'casual',
          },
        ],
      },
      {
        id: 'social-closing',
        name: 'Wrapping Up',
        name_es: 'Despedirse',
        description_es: 'La conversacion llega a su fin natural. Cerrar bien es tan importante como empezar bien.',
        exchanges: [
          {
            id: 'se-18',
            question: { en: "It was really nice talking to you.", es: 'Ha sido genial hablar contigo.' },
            answers: [
              { en: "Likewise! Let's stay in touch.", es: '¡Igualmente! Mantengamos el contacto.' },
              { en: "Same here. I really enjoyed it.", es: 'Lo mismo digo. Lo he disfrutado mucho.' },
            ],
            tip_es: '"Likewise" es la respuesta perfecta y natural a cualquier "nice to meet you" o "nice talking to you". Una sola palabra, elegante.',
            register: 'casual',
          },
          {
            id: 'se-19',
            question: { en: "I should get going, but let's do this again.", es: 'Me tengo que ir, pero repetimos.' },
            answers: [
              { en: "Definitely! I'll text you.", es: '¡Seguro! Te escribo.' },
              { en: "For sure. Have a great night!", es: 'Claro que si. ¡Que pases buena noche!' },
            ],
            register: 'casual',
          },
          {
            id: 'se-20',
            question: { en: "Take care!", es: '¡Cuidate!' },
            answers: [
              { en: "You too! See you around.", es: '¡Tu tambien! Nos vemos.' },
              { en: "Thanks, you too. It was fun.", es: 'Gracias, igualmente. Ha sido divertido.' },
            ],
            register: 'casual',
          },
        ],
      },
    ],
  },

  {
    id: 'professional-networking',
    title: 'Industry Event',
    title_es: 'Evento profesional',
    description_es: 'Festival de cine, conferencia, networking profesional — conoces a alguien del sector.',
    context_es: 'El tono es profesional pero accesible. Quieres mostrar competencia sin sonar rigido. Hay un objetivo implicito: crear una conexion profesional util.',
    color: '#34B87A',
    phases: [
      {
        id: 'pro-opening',
        name: 'Professional Introduction',
        name_es: 'Presentacion profesional',
        description_es: 'El primer contacto en un contexto profesional. Mas directo que en un evento social — la gente espera hablar de trabajo.',
        exchanges: [
          {
            id: 'pn-1',
            question: { en: "Hi, are you here for the festival?", es: 'Hola, ¿estas aqui por el festival?' },
            answers: [
              { en: "Yeah, I have a short in competition.", es: 'Si, tengo un corto en competicion.' },
              { en: "I am! I'm here to see what's new and meet people.", es: '¡Si! Estoy aqui para ver novedades y conocer gente.' },
            ],
            register: 'professional',
          },
          {
            id: 'pn-2',
            question: { en: "What brings you here?", es: '¿Que te trae por aqui?' },
            answers: [
              { en: "I'm presenting a project in the market section.", es: 'Estoy presentando un proyecto en la seccion de mercado.' },
              { en: "I'm here to network and explore co-production opportunities.", es: 'Estoy aqui para hacer networking y explorar oportunidades de coproduccion.' },
              { en: "I came for the masterclasses, but I'm staying for the conversations.", es: 'Vine por las masterclasses, pero me quedo por las conversaciones.', context_es: 'Tono mas ligero y cercano' },
            ],
            tip_es: '"What brings you here?" es la version profesional de "How do you know [host]?". Tu respuesta deberia dar pistas claras de tu perfil sin sonar a pitch.',
            register: 'professional',
          },
          {
            id: 'pn-3',
            question: { en: "Have you been to this festival before?", es: '¿Habias venido a este festival antes?' },
            answers: [
              { en: "First time, actually. Really impressed so far.", es: 'Primera vez, la verdad. Muy impresionado hasta ahora.' },
              { en: "Yeah, I come every year. It keeps getting better.", es: 'Si, vengo todos los anos. Cada vez mejora.' },
            ],
            register: 'professional',
          },
        ],
      },
      {
        id: 'pro-discovery',
        name: 'Professional Discovery',
        name_es: 'Descubrimiento profesional',
        description_es: 'Explorar el perfil profesional del otro: que hace, con quien trabaja, en que fase esta.',
        exchanges: [
          {
            id: 'pn-4',
            question: { en: "What do you do in the industry?", es: '¿A que te dedicas en la industria?' },
            answers: [
              { en: "I direct and produce independent films.", es: 'Dirijo y produzco peliculas independientes.' },
              { en: "I'm a director and I also do post-production work.", es: 'Soy director y tambien hago trabajo de postproduccion.' },
            ],
            register: 'professional',
          },
          {
            id: 'pn-5',
            question: { en: "Are you working on anything right now?", es: '¿Estas trabajando en algo ahora mismo?' },
            answers: [
              { en: "I'm developing a feature film. Still in early stages.", es: 'Estoy desarrollando un largometraje. Aun en fases tempranas.' },
              { en: "I just wrapped post on a short and I'm looking for what's next.", es: 'Acabo de terminar la post de un corto y estoy buscando lo siguiente.' },
            ],
            register: 'professional',
          },
          {
            id: 'pn-6',
            question: { en: "Who do you usually work with?", es: '¿Con quien sueles trabajar?' },
            answers: [
              { en: "Mostly small independent teams. I like to keep things lean.", es: 'Sobre todo equipos pequenos independientes. Me gusta mantenerlo agil.' },
              { en: "I have a few regular collaborators, but I'm always open to new people.", es: 'Tengo algunos colaboradores habituales, pero siempre estoy abierto a gente nueva.' },
            ],
            register: 'professional',
          },
          {
            id: 'pn-7',
            question: { en: "What's your background?", es: '¿Cual es tu trayectoria?' },
            answers: [
              { en: "I studied filmmaking and I've been working independently for about ten years.", es: 'Estudie cine y llevo unos diez anos trabajando de forma independiente.' },
              { en: "I come from a visual arts background and moved into film.", es: 'Vengo de las artes visuales y me pase al cine.' },
            ],
            tip_es: '"What\'s your background?" pregunta por tu formacion y trayectoria. No la traduzcas como "fondo" — se refiere a tu recorrido profesional.',
            register: 'professional',
          },
        ],
      },
      {
        id: 'pro-deepening',
        name: 'Deeper Professional Talk',
        name_es: 'Conversacion profesional profunda',
        description_es: 'Ya conoces su perfil basico. Ahora: enfoque creativo, mercado, modelo de negocio, vision.',
        exchanges: [
          {
            id: 'pn-8',
            question: { en: "What's your approach to filmmaking?", es: '¿Cual es tu enfoque como cineasta?' },
            answers: [
              { en: "I'm drawn to stories with strong visual language and emotional depth.", es: 'Me atraen las historias con un lenguaje visual fuerte y profundidad emocional.' },
              { en: "I try to find the universal in very personal stories.", es: 'Intento encontrar lo universal en historias muy personales.' },
            ],
            register: 'professional',
          },
          {
            id: 'pn-9',
            question: { en: "How do you handle funding?", es: '¿Como manejas la financiacion?' },
            answers: [
              { en: "I self-fund smaller projects and look for grants for bigger ones.", es: 'Los pequenos los autofinancio y para los grandes busco subvenciones.' },
              { en: "It's always the hardest part. Right now I'm exploring co-production deals.", es: 'Siempre es la parte mas dificil. Ahora estoy explorando acuerdos de coproduccion.' },
            ],
            register: 'professional',
          },
          {
            id: 'pn-10',
            question: { en: "What markets are you targeting?", es: '¿A que mercados apuntas?' },
            answers: [
              { en: "Festival circuit mainly, but I'm open to streaming and distribution.", es: 'Circuito de festivales principalmente, pero estoy abierto a streaming y distribucion.' },
              { en: "I'm focusing on European festivals and building from there.", es: 'Me estoy centrando en festivales europeos y construyendo desde ahi.' },
            ],
            register: 'professional',
          },
        ],
      },
      {
        id: 'pro-connecting',
        name: 'Making the Connection',
        name_es: 'Cerrar la conexion',
        description_es: 'El momento de proponer algo concreto: colaboracion, seguimiento, intercambio de contacto profesional.',
        exchanges: [
          {
            id: 'pn-11',
            question: { en: "I'd love to see your work.", es: 'Me encantaria ver tu trabajo.' },
            answers: [
              { en: "I can send you my reel. What's the best way to reach you?", es: 'Te puedo enviar mi reel. ¿Cual es la mejor forma de contactarte?' },
              { en: "Here's my website — everything's there.", es: 'Aqui esta mi web: esta todo ahi.' },
            ],
            register: 'professional',
          },
          {
            id: 'pn-12',
            question: { en: "We should collaborate sometime.", es: 'Deberiamos colaborar en algun momento.' },
            answers: [
              { en: "I'd be open to that. What kind of projects are you into?", es: 'Estaria abierto. ¿Que tipo de proyectos te interesan?' },
              { en: "Let's explore that. Send me an email and we'll set up a call.", es: 'Exploremos eso. Mandame un email y organizamos una llamada.' },
            ],
            register: 'professional',
          },
          {
            id: 'pn-13',
            question: { en: "Can I get your card?", es: '¿Me das tu tarjeta?' },
            answers: [
              { en: "Sure, here you go. Let's connect on LinkedIn too.", es: 'Claro, aqui tienes. Conectemos en LinkedIn tambien.' },
              { en: "I don't have cards, but let me add you on LinkedIn right now.", es: 'No tengo tarjetas, pero te agrego en LinkedIn ahora mismo.', context_es: 'Muy comun hoy en dia' },
            ],
            tip_es: 'Las tarjetas fisicas estan desapareciendo. "Let me add you on LinkedIn" o "I\'ll send you a connection request" son alternativas perfectas.',
            register: 'professional',
          },
          {
            id: 'pn-14',
            question: { en: "Let's keep in touch.", es: 'Mantengamos el contacto.' },
            answers: [
              { en: "Definitely. I'll reach out after the festival.", es: 'Sin duda. Te escribo despues del festival.' },
              { en: "For sure. Feel free to reach out anytime.", es: 'Claro que si. No dudes en escribirme cuando quieras.' },
            ],
            register: 'professional',
          },
        ],
      },
    ],
  },

  {
    id: 'potential-collaborator',
    title: 'Meeting a Collaborator',
    title_es: 'Conocer a un colaborador',
    description_es: 'Alguien te ha recomendado a esta persona, o habeis coincidido y hay potencial de trabajar juntos.',
    context_es: 'Es un terreno intermedio entre profesional y creativo. Quieres evaluar compatibilidad (creativa, personal, de ritmo de trabajo) sin que suene a entrevista.',
    color: '#FF8A6B',
    phases: [
      {
        id: 'collab-knowing',
        name: 'Getting to Know',
        name_es: 'Conocerse',
        description_es: 'Primer acercamiento: quien eres, que haces, como trabajas.',
        exchanges: [
          {
            id: 'co-1',
            question: { en: "I've heard great things about your work.", es: 'He oido cosas muy buenas de tu trabajo.' },
            answers: [
              { en: "That's really kind, thank you. What have you seen?", es: 'Muy amable, gracias. ¿Que has visto?' },
              { en: "Thanks! That means a lot. Who told you about me?", es: '¡Gracias! Eso significa mucho. ¿Quien te hablo de mi?' },
            ],
            register: 'creative',
          },
          {
            id: 'co-2',
            question: { en: "What's your creative process like?", es: '¿Como es tu proceso creativo?' },
            answers: [
              { en: "I usually start with a rough concept and then iterate a lot.", es: 'Normalmente empiezo con un concepto inicial y luego itero mucho.' },
              { en: "It's pretty intuitive — I follow what excites me and shape it along the way.", es: 'Es bastante intuitivo: sigo lo que me emociona y lo voy moldeando.' },
            ],
            tip_es: '"Process" en este contexto es "proceso creativo". No digas "my process of creation" — demasiado literal. "My creative process" o simplemente "my process" basta.',
            register: 'creative',
          },
          {
            id: 'co-3',
            question: { en: "What kind of projects excite you?", es: '¿Que tipo de proyectos te emocionan?' },
            answers: [
              { en: "Projects with a strong visual concept and something to say.", es: 'Proyectos con un concepto visual fuerte y algo que decir.' },
              { en: "Anything that pushes boundaries, honestly. I get bored with safe choices.", es: 'Cualquier cosa que empuje limites, la verdad. Me aburro con lo seguro.' },
            ],
            register: 'creative',
          },
          {
            id: 'co-4',
            question: { en: "What tools do you use?", es: '¿Que herramientas usas?' },
            answers: [
              { en: "DaVinci for editing, and I've been experimenting with AI tools for pre-production.", es: 'DaVinci para edicion, y estoy experimentando con herramientas de IA para preproduccion.' },
              { en: "It depends on the project. I try to stay flexible with my toolkit.", es: 'Depende del proyecto. Intento ser flexible con mis herramientas.' },
            ],
            register: 'creative',
          },
        ],
      },
      {
        id: 'collab-exploring',
        name: 'Exploring Collaboration',
        name_es: 'Explorar la colaboracion',
        description_es: 'Ya hay interes mutuo. Ahora toca tantear: disponibilidad, condiciones, compatibilidad.',
        exchanges: [
          {
            id: 'co-5',
            question: { en: "Would you be open to working together?", es: '¿Estarias abierto a trabajar juntos?' },
            answers: [
              { en: "Absolutely. What did you have in mind?", es: 'Por supuesto. ¿Que tenias en mente?' },
              { en: "It depends on the project, but I'm definitely interested.", es: 'Depende del proyecto, pero sin duda me interesa.' },
            ],
            register: 'creative',
          },
          {
            id: 'co-6',
            question: { en: "What would you need from my side?", es: '¿Que necesitarias de mi parte?' },
            answers: [
              { en: "Mainly creative freedom and a clear brief.", es: 'Principalmente libertad creativa y un brief claro.' },
              { en: "Just trust and good communication. That's what makes or breaks it.", es: 'Solo confianza y buena comunicacion. Eso es lo que lo hace o lo rompe.' },
            ],
            register: 'creative',
          },
          {
            id: 'co-7',
            question: { en: "When are you available?", es: '¿Cuando estas disponible?' },
            answers: [
              { en: "I'm pretty flexible right now. When were you thinking?", es: 'Ahora mismo soy bastante flexible. ¿Cuando estabas pensando?' },
              { en: "After I finish my current project — probably in a month or so.", es: 'Cuando termine mi proyecto actual, probablemente en un mes mas o menos.' },
            ],
            register: 'creative',
          },
          {
            id: 'co-8',
            question: { en: "What's your rate?", es: '¿Cual es tu tarifa?' },
            answers: [
              { en: "It depends on the scope. Let's discuss the project first.", es: 'Depende del alcance. Hablemos del proyecto primero.' },
              { en: "I usually charge by project, not by hour. Let me put together a quote.", es: 'Normalmente cobro por proyecto, no por hora. Te preparo un presupuesto.', context_es: 'Suena mas profesional' },
            ],
            tip_es: 'Nunca digas tu precio directamente sin contexto. "Let\'s discuss the scope first" te da poder de negociacion y muestra profesionalidad.',
            register: 'professional',
          },
        ],
      },
    ],
  },

  {
    id: 'follow-up-coffee',
    title: 'Follow-up Coffee',
    title_es: 'Cafe de seguimiento',
    description_es: 'Segundo encuentro con alguien que conociste antes. Ya hay contexto, la conversacion arranca desde otro lugar.',
    context_es: 'El tono es mas calido que el primer encuentro. Hay familiaridad pero no confianza plena. Es el momento de profundizar y ver si hay quimica real.',
    color: '#F5A623',
    phases: [
      {
        id: 'coffee-warmup',
        name: 'Warming Up',
        name_es: 'Retomar el contacto',
        description_es: 'Reconectar, preguntar como va, recordar lo que compartisteis la primera vez.',
        exchanges: [
          {
            id: 'cf-1',
            question: { en: "Hey! Good to see you again.", es: '¡Ey! Me alegro de verte de nuevo.' },
            answers: [
              { en: "You too! It's been a while.", es: '¡Igualmente! Cuanto tiempo.' },
              { en: "Same here! Thanks for making time.", es: '¡Lo mismo! Gracias por sacar tiempo.' },
            ],
            register: 'casual',
          },
          {
            id: 'cf-2',
            question: { en: "How've you been since we last met?", es: '¿Como te ha ido desde la ultima vez?' },
            answers: [
              { en: "Great, actually. Been really busy with a new project.", es: 'Bien, la verdad. He estado muy liado con un proyecto nuevo.' },
              { en: "Good, good. A lot has changed, actually.", es: 'Bien, bien. Han cambiado bastantes cosas, la verdad.' },
            ],
            register: 'casual',
          },
          {
            id: 'cf-3',
            question: { en: "How's the project going?", es: '¿Como va el proyecto?' },
            answers: [
              { en: "It's coming along. We hit a few bumps, but we're on track.", es: 'Va avanzando. Hemos tenido algunos baches, pero vamos bien.' },
              { en: "Really well, actually. We just got some great news.", es: 'Muy bien, la verdad. Acabamos de recibir buenas noticias.' },
            ],
            tip_es: '"It\'s coming along" es una forma muy natural de decir "va avanzando". Mucho mejor que "it\'s going" solo.',
            register: 'casual',
          },
        ],
      },
      {
        id: 'coffee-catching-up',
        name: 'Catching Up',
        name_es: 'Ponerse al dia',
        description_es: 'Actualizar, compartir novedades, profundizar en lo que quedo pendiente.',
        exchanges: [
          {
            id: 'cf-4',
            question: { en: "What have you been up to lately?", es: '¿En que has estado ultimamente?' },
            answers: [
              { en: "Working on a couple of things — film stuff and a tech project.", es: 'Trabajando en un par de cosas: temas de cine y un proyecto tech.' },
              { en: "Honestly, just heads down working. But good things are happening.", es: 'Sinceramente, currando con la cabeza agachada. Pero estan pasando cosas buenas.' },
            ],
            register: 'casual',
          },
          {
            id: 'cf-5',
            question: { en: "Any updates on the film?", es: '¿Alguna novedad con la peli?' },
            answers: [
              { en: "Yeah, we're in pre-production now. Exciting times.", es: 'Si, ya estamos en preproduccion. Tiempos emocionantes.' },
              { en: "We got into a lab program, so things are moving.", es: 'Entramos en un programa de lab, asi que las cosas avanzan.' },
            ],
            register: 'casual',
          },
          {
            id: 'cf-6',
            question: { en: "What's next for you?", es: '¿Que es lo siguiente para ti?' },
            answers: [
              { en: "I'm planning to shoot in the fall if everything lines up.", es: 'Planeo rodar en otono si todo cuadra.' },
              { en: "I'm figuring that out right now, actually. A few options on the table.", es: 'Estoy en eso ahora mismo, la verdad. Hay varias opciones sobre la mesa.' },
            ],
            tip_es: '"If everything lines up" es una forma natural de decir "si todo cuadra/encaja". Mucho mejor que "if everything coincides".',
            register: 'casual',
          },
        ],
      },
    ],
  },

  {
    id: 'online-intro',
    title: 'Online Introduction',
    title_es: 'Introduccion online',
    description_es: 'Videollamada, LinkedIn, email frio — el primer contacto es digital.',
    context_es: 'Sin lenguaje corporal, cada palabra pesa mas. El tono debe ser calido pero eficiente. La gente tiene menos paciencia online.',
    color: '#5B8DEF',
    phases: [
      {
        id: 'online-opening',
        name: 'Digital First Contact',
        name_es: 'Primer contacto digital',
        description_es: 'Mensajes iniciales, conexiones, primera videollamada.',
        exchanges: [
          {
            id: 'on-1',
            question: { en: "Thanks for connecting!", es: '¡Gracias por conectar!' },
            answers: [
              { en: "Likewise! I've been following your work.", es: '¡Igualmente! He estado siguiendo tu trabajo.' },
              { en: "Of course! Your profile caught my attention.", es: '¡Por supuesto! Tu perfil me llamo la atencion.' },
            ],
            register: 'professional',
          },
          {
            id: 'on-2',
            question: { en: "I came across your work on [platform].", es: 'Vi tu trabajo en [plataforma].' },
            answers: [
              { en: "Oh great! Which piece did you see?", es: '¡Genial! ¿Que pieza viste?' },
              { en: "Thanks for reaching out! Happy to chat.", es: '¡Gracias por escribir! Encantado de charlar.' },
            ],
            register: 'professional',
          },
          {
            id: 'on-3',
            question: { en: "Would you be up for a quick call?", es: '¿Te apeteceria hacer una llamada rapida?' },
            answers: [
              { en: "Sure, when works for you?", es: 'Claro, ¿cuando te viene bien?' },
              { en: "I'd prefer to chat here first, if that's okay.", es: 'Prefiero charlar por aqui primero, si no te importa.', context_es: 'Si quieres filtrar antes de invertir tiempo' },
            ],
            tip_es: '"Would you be up for..." es una invitacion casual. Mucho mejor que "Would you like to make a call?" — que suena demasiado formal.',
            register: 'professional',
          },
          {
            id: 'on-4',
            question: { en: "How did you get into this?", es: '¿Como entraste en esto?' },
            answers: [
              { en: "It's a long story, but basically I started with short films and it grew from there.", es: 'Es largo de contar, pero basicamente empece con cortometrajes y fue creciendo.' },
              { en: "Kind of by accident, honestly. But once I started, I couldn't stop.", es: 'Un poco por accidente, la verdad. Pero una vez que empece, no pude parar.' },
            ],
            register: 'professional',
          },
        ],
      },
    ],
  },

  {
    id: 'dinner-conversation',
    title: 'Dinner Conversation',
    title_es: 'Conversacion en cena',
    description_es: 'Cena con conocidos o semi-conocidos. El ambiente invita a conversaciones mas largas y profundas.',
    context_es: 'Una cena permite mas profundidad que un coctel. Hay tiempo, hay comodidad, hay vino. Las conversaciones pueden ir de lo ligero a lo profundo sin forzar.',
    color: '#F0ABFC',
    phases: [
      {
        id: 'dinner-light',
        name: 'Light Conversation',
        name_es: 'Conversacion ligera',
        description_es: 'Temas accesibles: planes, viajes, cultura, recomendaciones.',
        exchanges: [
          {
            id: 'dc-1',
            question: { en: "Have you traveled anywhere interesting recently?", es: '¿Has viajado a algun sitio interesante ultimamente?' },
            answers: [
              { en: "Yeah, I was in Berlin last month. Amazing city.", es: 'Si, estuve en Berlin el mes pasado. Ciudad increible.' },
              { en: "Not recently, but I'm planning a trip to [place].", es: 'Ultimamente no, pero estoy planeando un viaje a [lugar].' },
            ],
            register: 'casual',
          },
          {
            id: 'dc-2',
            question: { en: "Read anything good lately?", es: '¿Has leido algo bueno ultimamente?' },
            answers: [
              { en: "Actually, yes — I just finished [book] and it blew my mind.", es: 'Pues si — acabo de terminar [libro] y me volo la cabeza.' },
              { en: "I've been more into podcasts lately, to be honest.", es: 'Ultimamente estoy mas con podcasts, para ser sincero.' },
            ],
            register: 'casual',
          },
          {
            id: 'dc-3',
            question: { en: "What's the best thing you've watched recently?", es: '¿Que es lo mejor que has visto ultimamente?' },
            answers: [
              { en: "That's a tough one. Probably [title] — the storytelling was incredible.", es: 'Dificil. Probablemente [titulo] — la narrativa era increible.' },
              { en: "I've been rewatching old Kubrick films, actually.", es: 'He estado revisitando peliculas antiguas de Kubrick, la verdad.' },
            ],
            register: 'casual',
          },
        ],
      },
      {
        id: 'dinner-deep',
        name: 'Going Deeper',
        name_es: 'Ir mas profundo',
        description_es: 'La conversacion se pone interesante: valores, visiones, reflexiones personales.',
        exchanges: [
          {
            id: 'dc-4',
            question: { en: "What drives you?", es: '¿Que te motiva?' },
            answers: [
              { en: "The need to tell stories that matter. Stories that make people feel something.", es: 'La necesidad de contar historias que importan. Historias que hagan sentir algo a la gente.' },
              { en: "Honestly? Curiosity. I just want to understand how things work.", es: '¿Sinceramente? La curiosidad. Solo quiero entender como funcionan las cosas.' },
            ],
            register: 'deep',
          },
          {
            id: 'dc-5',
            question: { en: "What's been your biggest challenge so far?", es: '¿Cual ha sido tu mayor reto hasta ahora?' },
            answers: [
              { en: "Balancing the creative and the business side. They pull in different directions.", es: 'Equilibrar la parte creativa y la de negocio. Tiran en direcciones opuestas.' },
              { en: "Staying patient. Good work takes time, and the world moves fast.", es: 'Mantener la paciencia. El buen trabajo lleva tiempo, y el mundo va rapido.' },
            ],
            register: 'deep',
          },
          {
            id: 'dc-6',
            question: { en: "Where do you see yourself in five years?", es: '¿Donde te ves en cinco anos?' },
            answers: [
              { en: "Directing my second or third feature, hopefully. And still learning.", es: 'Dirigiendo mi segundo o tercer largo, espero. Y sigue aprendiendo.' },
              { en: "I try not to plan that far ahead. But I want to be making work I'm proud of.", es: 'Intento no planear tan lejos. Pero quiero estar haciendo trabajo del que me sienta orgulloso.' },
            ],
            register: 'deep',
          },
          {
            id: 'dc-7',
            question: { en: "What's something people don't know about you?", es: '¿Algo que la gente no sepa de ti?' },
            answers: [
              { en: "I'm actually really into technology and AI. People don't expect that from a filmmaker.", es: 'En realidad me apasiona mucho la tecnologia y la IA. La gente no lo espera de un cineasta.' },
              { en: "I'm a morning person. I do my best thinking before 9 AM.", es: 'Soy de madrugar. Pienso mejor antes de las 9 de la manana.' },
            ],
            register: 'deep',
          },
          {
            id: 'dc-8',
            question: { en: "How do you deal with rejection?", es: '¿Como manejas el rechazo?' },
            answers: [
              { en: "It's never easy, but I've learned to separate the work from my identity.", es: 'Nunca es facil, pero he aprendido a separar el trabajo de mi identidad.' },
              { en: "I try to see it as feedback, not failure. Easier said than done, though.", es: 'Intento verlo como feedback, no como fracaso. Mas facil decirlo que hacerlo.' },
            ],
            tip_es: '"Easier said than done" es una expresion muy util: "mas facil decirlo que hacerlo". Usala cuando reconoces que algo es dificil en la practica.',
            register: 'deep',
          },
          {
            id: 'dc-9',
            question: { en: "What are you most proud of?", es: '¿De que estas mas orgulloso?' },
            answers: [
              { en: "Staying independent. It hasn't been easy, but it's been worth it.", es: 'Haber mantenido mi independencia. No ha sido facil, pero ha valido la pena.' },
              { en: "The relationships I've built along the way. The work matters, but the people matter more.", es: 'Las relaciones que he construido en el camino. El trabajo importa, pero la gente importa mas.' },
            ],
            register: 'deep',
          },
        ],
      },
    ],
  },

  {
    id: 'creative-meetup',
    title: 'Creative Meetup',
    title_es: 'Encuentro creativo',
    description_es: 'Evento de creativos, coworking, taller — conoces a otro creativo en un espacio compartido.',
    context_es: 'Ambiente relajado pero con chispa creativa. La gente esta abierta a compartir ideas y procesos. Es un terreno fertil para conexiones genuinas.',
    color: '#6DD3D6',
    phases: [
      {
        id: 'creative-opening',
        name: 'Creative Connection',
        name_es: 'Conexion creativa',
        description_es: 'Primer contacto entre creativos: compartir pasiones, herramientas, procesos.',
        exchanges: [
          {
            id: 'cm-1',
            question: { en: "What are you working on these days?", es: '¿En que andas metido estos dias?' },
            answers: [
              { en: "I'm experimenting with AI-generated visuals for a film project.", es: 'Estoy experimentando con visuales generados por IA para un proyecto de cine.' },
              { en: "A few things at once, honestly. I work better when I juggle projects.", es: 'Varias cosas a la vez, la verdad. Trabajo mejor cuando hago malabarismos con proyectos.' },
            ],
            register: 'creative',
          },
          {
            id: 'cm-2',
            question: { en: "What inspires you creatively?", es: '¿Que te inspira creativamente?' },
            answers: [
              { en: "Real conversations, mostly. And cinema — always cinema.", es: 'Conversaciones reales, sobre todo. Y el cine — siempre el cine.' },
              { en: "The gap between what exists and what could exist.", es: 'La brecha entre lo que existe y lo que podria existir.' },
            ],
            register: 'creative',
          },
          {
            id: 'cm-3',
            question: { en: "How do you balance creativity and productivity?", es: '¿Como equilibras creatividad y productividad?' },
            answers: [
              { en: "Systems. I have routines that protect my creative time.", es: 'Sistemas. Tengo rutinas que protegen mi tiempo creativo.' },
              { en: "Honestly, I'm still figuring that out. Some weeks are better than others.", es: 'Sinceramente, sigo descubriendolo. Algunas semanas van mejor que otras.' },
            ],
            register: 'creative',
          },
        ],
      },
    ],
  },
];

export const CONVERSATION_TOOLS: ConversationTool[] = [
  { en: "That's really interesting.", es: 'Eso es muy interesante.', category: 'interest' },
  { en: "Tell me more about that.", es: 'Cuentame mas sobre eso.', category: 'interest' },
  { en: "How did that come about?", es: '¿Como surgio eso?', category: 'interest' },
  { en: "I hadn't thought about it that way.", es: 'No lo habia pensado asi.', category: 'interest' },
  { en: "I know exactly what you mean.", es: 'Se exactamente a que te refieres.', category: 'interest' },
  { en: "What was that like?", es: '¿Como fue eso?', category: 'interest' },

  { en: "Absolutely.", es: 'Totalmente.', category: 'agreement' },
  { en: "That makes sense.", es: 'Tiene sentido.', category: 'agreement' },
  { en: "I completely agree.", es: 'Estoy totalmente de acuerdo.', category: 'agreement' },
  { en: "You make a good point.", es: 'Buen punto. / Tienes razon.', category: 'agreement' },
  { en: "Yeah, for sure.", es: 'Si, seguro. / Si, claro.', category: 'agreement' },
  { en: "Exactly.", es: 'Exacto.', category: 'agreement' },

  { en: "I see your point, but...", es: 'Entiendo tu punto, pero...', category: 'disagreement' },
  { en: "I'm not sure I agree on that.", es: 'No estoy seguro de estar de acuerdo con eso.', category: 'disagreement' },
  { en: "That's interesting, although...", es: 'Es interesante, aunque...', category: 'disagreement' },
  { en: "I'd push back on that a little.", es: 'Yo matizaria un poco eso.', category: 'disagreement', note_es: 'Suave pero firme. Muy usado en ambitos profesionales.' },
  { en: "I see it differently.", es: 'Yo lo veo diferente.', category: 'disagreement' },

  { en: "Speaking of which...", es: 'Hablando de eso...', category: 'transition' },
  { en: "That reminds me...", es: 'Eso me recuerda...', category: 'transition' },
  { en: "On a different note...", es: 'Cambiando de tema...', category: 'transition' },
  { en: "By the way...", es: 'Por cierto...', category: 'transition' },
  { en: "Anyway...", es: 'En fin... / Bueno...', category: 'transition', note_es: 'Util para reconducir una conversacion que se ha desviado.' },

  { en: "That's a great question.", es: 'Buena pregunta.', category: 'time' },
  { en: "Let me think about that.", es: 'Dejame pensarlo.', category: 'time' },
  { en: "How do I put this...", es: '¿Como lo digo...?', category: 'time' },
  { en: "It's hard to explain, but...", es: 'Es dificil de explicar, pero...', category: 'time' },
  { en: "I'd have to think about that one.", es: 'Tendria que pensarlo.', category: 'time' },

  { en: "No way!", es: '¡No me digas! / ¡Venga ya!', category: 'reaction' },
  { en: "That's amazing.", es: 'Eso es increible.', category: 'reaction' },
  { en: "I can totally relate to that.", es: 'Me identifico totalmente con eso.', category: 'reaction' },
  { en: "Seriously?", es: '¿En serio?', category: 'reaction' },
  { en: "That's wild.", es: 'Eso es una locura.', category: 'reaction', note_es: 'Muy casual. Expresa sorpresa sin juicio.' },
  { en: "I would have never guessed.", es: 'Nunca lo habria imaginado.', category: 'reaction' },

  { en: "In my experience...", es: 'En mi experiencia...', category: 'opinion' },
  { en: "The way I see it...", es: 'Como yo lo veo...', category: 'opinion' },
  { en: "I have mixed feelings about that.", es: 'Tengo sentimientos encontrados sobre eso.', category: 'opinion' },
  { en: "I'm still figuring that out.", es: 'Todavia lo estoy descubriendo.', category: 'opinion', note_es: 'Perfecta para cuando no tienes opinion clara. Es honesta y respetable.' },
  { en: "If you ask me...", es: 'Si me preguntas a mi...', category: 'opinion' },
  { en: "From what I've seen...", es: 'Por lo que he visto...', category: 'opinion' },
];
