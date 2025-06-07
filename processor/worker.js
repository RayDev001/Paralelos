const { parentPort, workerData } = require('worker_threads');

// Simulamos un trabajo pesado (por ejemplo, cálculo de facturación o procesamiento de imagen)
// Aquí simplemente haremos un bucle que consuma CPU durante un tiempo.
function heavyComputation(data) {
  // Por ejemplo, iteramos en un bucle que tarda ~500ms en CPU
  const start = Date.now();
  while (Date.now() - start < 500) {
    // Operaciones ficticias para consumir CPU
    Math.sqrt(Math.random() * 1000000);
  }
  return { subtaskId: data.subtaskId, processedAt: new Date().toISOString() };
}

const result = heavyComputation(workerData);
parentPort.postMessage(result);
