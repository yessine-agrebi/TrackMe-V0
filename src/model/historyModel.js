// Importations nécessaires
import mongoose from 'mongoose';

// Définition du schéma de la classe de localisation
const historySchema = new mongoose.Schema({
  device: {
    id: Number,
    name: String
  },
  positions: [{
    latitude: Number,
    longitude: Number,
    speed: Number,
    date: String,
    time: String
  }]
});

// Création du modèle de classe de localisation
const History = mongoose.model('History', historySchema);

// Exportation du modèle
export default History;
