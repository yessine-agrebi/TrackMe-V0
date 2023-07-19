// Importations nécessaires
import mongoose from 'mongoose';

// Définition du schéma de la classe de localisation
const locationSchema = new mongoose.Schema({
  channelId: { type: Number, required: true },
  deviceId: { type: Number, required: true },
  deviceName: { type: String, required: true },
  locations: {type: Array}
});

// Création du modèle de classe de localisation
const Location = mongoose.model('Location', locationSchema);

// Exportation du modèle
export default Location;
