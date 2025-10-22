-- Insert emergency resources
INSERT INTO emergency_resources (name, phone, description, category, location) VALUES 
('Línea Nacional de Prevención del Suicidio', '1-800-273-8255', 'Línea de crisis 24/7 para prevención del suicidio', 'crisis', 'Nacional'),
('Crisis Text Line', '741741', 'Envía "HOME" para recibir apoyo por mensaje de texto', 'crisis', 'Nacional'),
('Servicios de Emergencia', '911', 'Para emergencias médicas y de salud mental', 'emergency', 'Nacional'),
('Ministerio de Salud - Salud Mental', '1515', 'Línea de apoyo psicológico', 'mental_health', 'Guatemala'),
('Centro de Escucha San José', '2361-5555', 'Apoyo cristiano y consejería', 'christian_support', 'Guatemala');

-- Insert wellness content with Christian principles
INSERT INTO wellness_content (title, content, category, tags) VALUES 
(
    'Respiración con Oración', 
    'Una técnica de respiración combinada con oración para encontrar paz interior.

    Pasos:
    1. Encuentra un lugar tranquilo donde puedas estar solo con Dios
    2. Siéntate cómodamente con la espalda recta
    3. Cierra los ojos y respira profundamente
    4. Al inhalar, di mentalmente: "Jesús, dame tu paz"
    5. Al exhalar, di: "Libero mis preocupaciones a ti"
    6. Repite durante 5-10 minutos
    7. Termina con una oración de gratitud

    Versículo para meditar: "La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo." - Juan 14:27',
    'breathing',
    '{"oración", "respiración", "paz", "Juan 14:27", "mindfulness cristiano"}'
),
(
    'Meditación en los Salmos',
    'Una práctica de meditación cristiana basada en los Salmos para encontrar consuelo y fortaleza.

    Cómo practicar:
    1. Elige un Salmo que resuene con tu situación actual
    2. Lee el Salmo completo lentamente, dos veces
    3. Identifica una frase o versículo que te llame la atención
    4. Repite esa frase en tu mente, permitiendo que penetre en tu corazón
    5. Imagina a Dios hablándote a través de esas palabras
    6. Permanece en silencio, escuchando la voz de Dios
    7. Termina agradeciéndole por su palabra

    Salmos recomendados para diferentes situaciones:
    - Ansiedad: Salmo 23, Salmo 46
    - Tristeza: Salmo 34, Salmo 42
    - Miedo: Salmo 27, Salmo 91
    - Gratitud: Salmo 100, Salmo 118',
    'meditation',
    '{"salmos", "meditación", "palabra de Dios", "contemplación", "escritura"}'
),
(
    'Oración de Entrega',
    'Una oración para entregar nuestras cargas y preocupaciones a Dios, basada en 1 Pedro 5:7.

    Oración guiada:
    "Padre celestial, vengo ante ti reconociendo que no puedo cargar solo con estas preocupaciones. 
    Tu palabra dice que puedo echar toda mi ansiedad sobre ti, porque tú tienes cuidado de mí.

    Hoy te entrego:
    - Mis miedos sobre el futuro
    - Mis preocupaciones sobre [situación específica]
    - Mi necesidad de control
    - Mi angustia y dolor

    Confío en que tú eres bueno, que me amas incondicionalmente, y que tienes un plan perfecto para mi vida.
    Ayúdame a descansar en tu soberanía y a caminar en fe, no en temor.

    En el nombre de Jesús, Amén."

    Reflexión: Después de orar, toma un momento para sentir el alivio de haber entregado tus cargas a Dios. Recuerda que Él es fiel y cuidará de ti.',
    'prayer',
    '{"oración", "entrega", "1 Pedro 5:7", "confianza", "ansiedad"}'
),
(
    'Técnica de Respiración 4-7-8 Cristiana',
    'Una adaptación cristiana de la técnica de respiración 4-7-8 para reducir la ansiedad.

    Instrucciones:
    1. Siéntate cómodamente y coloca una mano en tu corazón
    2. Exhala completamente
    3. Inhala por la nariz contando hasta 4, pensando: "Dios está conmigo"
    4. Mantén la respiración contando hasta 7, pensando: "Su amor me rodea"
    5. Exhala por la boca contando hasta 8, pensando: "Su paz llena mi ser"
    6. Repite el ciclo 4 veces

    Versículos para meditar durante la práctica:
    - "Estad quietos, y conoced que yo soy Dios" - Salmo 46:10
    - "En quietud y en confianza será vuestra fortaleza" - Isaías 30:15

    Beneficios: Esta técnica activa el sistema nervioso parasimpático, reduciendo la respuesta de estrés mientras nos conectamos con la presencia de Dios.',
    'breathing',
    '{"técnica 4-7-8", "respiración", "ansiedad", "Salmo 46:10", "calma"}'
),
(
    'Cuando Sientes que No Puedes Más - Recursos de Crisis',
    'Si estás pasando por pensamientos de autolesión o suicidio, por favor busca ayuda inmediatamente.

    CONTACTOS DE EMERGENCIA:
    - Servicios de emergencia: 911
    - Línea Nacional de Prevención del Suicidio: 1-800-273-8255
    - Crisis Text Line: Envía "HOME" al 741741

    RECUERDA:
    - Tu vida tiene valor infinito ante los ojos de Dios
    - Esta crisis pasará, aunque ahora no lo sientas así
    - No estás solo, Dios está contigo en el valle más oscuro
    - Hay ayuda disponible y gente que se preocupa por ti

    VERSÍCULOS DE ESPERANZA:
    - "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis." - Jeremías 29:11
    - "Las misericordias de Jehová jamás terminan, pues nunca falta su compasión. Nuevas son cada mañana; grande es tu fidelidad." - Lamentaciones 3:22-23

    PASOS INMEDIATOS:
    1. Busca ayuda profesional ahora
    2. Llama a un amigo o familiar de confianza
    3. Ve a la sala de emergencias más cercana
    4. Contacta a tu pastor o líder espiritual

    Tu iglesia, tu familia y tus amigos te necesitan. Tu historia no ha terminado.',
    'emergency',
    '{"crisis", "suicidio", "emergencia", "Jeremías 29:11", "esperanza", "ayuda profesional"}'
),
(
    'Gratitud Diaria - Práctica Cristiana',
    'Una práctica diaria de gratitud basada en 1 Tesalonicenses 5:18 para cultivar un corazón agradecido.

    Práctica matutina (5 minutos):
    1. Al despertar, antes de revisar el teléfono, toma 3 respiraciones profundas
    2. Agradece a Dios por el nuevo día que te ha dado
    3. Menciona 3 cosas específicas por las que estás agradecido
    4. Incluye una bendición que a menudo das por sentada
    5. Pide a Dios que te ayude a mantener un corazón agradecido durante el día

    Práctica nocturna (5 minutos):
    1. Antes de dormir, reflexiona sobre tu día
    2. Identifica 3 momentos en los que viste la mano de Dios
    3. Agradece por las personas que bendijeron tu día
    4. Incluso en días difíciles, busca una pequeña bendición
    5. Termina con: "Gracias, Señor, por tu fidelidad constante"

    Versículo clave: "Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros en Cristo Jesús." - 1 Tesalonicenses 5:18',
    'mindfulness',
    '{"gratitud", "1 Tesalonicenses 5:18", "práctica diaria", "bendiciones", "reflexión"}'
);

-- Insert sample mood entries for the demo user
INSERT INTO mood_entries (user_id, mood_score, mood_description, notes, tags) VALUES 
('demo-user', 7, 'Esperanzado y en paz', 'Tuve un tiempo de oración muy especial esta mañana. Me siento conectado con Dios.', '{"oración", "paz", "esperanza"}'),
('demo-user', 4, 'Un poco ansioso', 'Preocupado por el futuro, pero tratando de confiar en los planes de Dios.', '{"ansiedad", "futuro", "confianza"}'),
('demo-user', 8, 'Lleno de gratitud', 'Pude ver tantas bendiciones hoy. Dios es bueno.', '{"gratitud", "bendiciones", "gozo"}'),
('demo-user', 5, 'Neutral pero reflexivo', 'Día tranquilo. Meditando en los Salmos.', '{"reflexión", "salmos", "meditación"}';