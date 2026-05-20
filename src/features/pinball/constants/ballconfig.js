export const MAX_CHARGE_TIME = 1500;
export const MAX_VELOCITY = 4;

// Position de spawn principale (couloir de lancement)
export const SPAWN = { x: 0.38, y: 0.03, z: 0.76 };

// Position de spawn de debug (milieu du plateau)
export const DEBUG_SPAWN = { x: 0.1, y: 0.03, z: 0.0001 };

// Seuil Y en dessous duquel la balle est considérée perdue
export const FALL_THRESHOLD_Y = -1;

// Impulsion appliquée lors d'un ball-boost (lane sensor)
export const BOOST_IMPULSE = { x: -0.3, y: 0.15, z: -2.5 };
