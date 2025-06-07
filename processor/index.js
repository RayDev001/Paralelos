const express = require('express');
const { Worker } = require('worker_threads');
const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = 4000;
const NUM_WORKERS = 4; // Cantidad de workers para paralelismo

// Endpoint para recibir tareas de facturación (o cualquier tarea “pesada”)
app.post('/process', async (req, res) => {
  const { taskId = Date.now(), payload = {} } = req.body;

  console.log(`📥 [Processor] Tarea recibida: ${taskId}`);

  // Dividimos la “tarea” en subtareas para enviarlas a los workers
  // En este ejemplo, simularemos 4 subtareas iguales. 
  const subtasks = Array.from({ length: NUM_WORKERS }, (_, i) => ({
    subtaskId: `${taskId}-sub${i + 1}`,
    payloadPart: payload,
  }));

  // Función que retorna una promesa resolviendo cuando un worker termina
  const runWorker = (subtask) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker('./worker.js', { workerData: subtask });
      worker.on('message', (result) => {
        console.log(`🧵 [Worker] Subtarea ${subtask.subtaskId} completada con resultado:`, result);
        resolve(result);
      });
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker parado con código ${code}`));
        }
      });
    });
  };

  try {
    // Ejecutamos todas las subtareas en paralelo
    const results = await Promise.all(subtasks.map(runWorker));

    // Simulamos consolidar resultados
    const consolidatedResult = { taskId, results };

    // Cuando finaliza la tarea completa, avisamos al notificador
    await axios.post(`http://notificador:3002/notify`, {
      deviceId: payload.deviceId || 'unknown-device',
      message: `Tu tarea ${taskId} ha sido procesada correctamente.`,
    });

    console.log(`✅ [Processor] Tarea ${taskId} completada y notificador avisado.`);
    
    return res.json({
      taskId,
      status: 'completed',
      result: consolidatedResult,
    });
  } catch (err) {
    console.error(`❌ [Processor] Error procesando tarea ${taskId}:`, err);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Processor corriendo en http://0.0.0.0:${PORT}`);
});
