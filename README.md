# 📅 Appointment Service

Este servicio permite registrar y procesar solicitudes de agendamiento médico mediante una arquitectura serverless basada en AWS.

---

## 🚀 Tecnologías usadas

- [Serverless Framework](https://www.serverless.com/)
- AWS Lambda
- Amazon DynamoDB
- Amazon SNS
- Amazon SQS
- Amazon RDS (MySQL)
- Amazon EventBridge
- Node.js + TypeScript

---

## 📦 Estructura del Proyecto

appointment-service/
├── src/
│ └── handlers/
│ └── appointment.ts # Funciones Lambda (register, getByInsuredId, updateStatus)
├── test/
│ └── payloads/ # Cargas de prueba locales
├── serverless.yml # Infraestructura como código
└── README.md # Este archivo

---

## ✨ Funcionalidad

1. **POST `/appointment`**  
   Guarda una cita en DynamoDB con estado `"pending"` y publica un mensaje en SNS.

2. **SNS → SQS por país**  
   Mensajes se enrutan por `countryISO` a colas específicas: `SQS_PE` o `SQS_CL`.

3. **Lambdas por país (`appointment_pe` / `appointment_cl`)**  
   Procesan el mensaje desde su SQS, y guardan la cita en una base de datos MySQL.

4. **EventBridge → SQS → updateStatus**  
   Confirmaciones viajan por EventBridge a una SQS final que actualiza el estado a `"completed"` en DynamoDB.

5. **GET `/appointment/{insuredId}`**  
   Recupera todas las citas asociadas al asegurado.

---

---

## 📥 Instalación

```bash
git clone https://github.com/JudithPortocarrero/reservas-app-back.git
npm install
```

----

## 📥 Pruebas Locales

    Registrar cita
```bash
npx serverless invoke local --function register --path test/payload-register.json
```

    Obtener citas
```bash
npx serverless invoke local --function getByInsuredId --path test/payload-getById.json
```

    Simular confirmación desde EventBridge
```bash
npx serverless invoke local --function updateStatus --path test/payload-updateStatus.json
```

----


## 🚀 Despliegue

```bash
npx serverless deploy
```

## 🔐 Variables de entorno en serverless.yml.

APPOINTMENTS_TABLE=AppointmentsTable
MYSQL_HOST=...
MYSQL_USER=...
MYSQL_PASSWORD=...
MYSQL_DB=...
