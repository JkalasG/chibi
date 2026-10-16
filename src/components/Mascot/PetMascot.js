import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Easing, Text } from 'react-native';
import { SvgXml } from 'react-native-svg';

const DEFS = `
  <defs>
    <linearGradient id="furGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFC875"/>
      <stop offset="60%" stop-color="#F69B42"/>
      <stop offset="100%" stop-color="#E57C29"/>
    </linearGradient>
    <linearGradient id="creamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F7E5C8"/>
    </linearGradient>
    <linearGradient id="scarfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#55C48A"/>
      <stop offset="60%" stop-color="#348C60"/>
      <stop offset="100%" stop-color="#1E583B"/>
    </linearGradient>
    <linearGradient id="eggGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="75%" stop-color="#F7EAD6"/>
      <stop offset="100%" stop-color="#DFCBAB"/>
    </linearGradient>
  </defs>
`;

const wrapSvg = (content) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">${DEFS}${content}</svg>`;

export const MASCOT_SVGS = {
  sombra: wrapSvg(`
    <ellipse cx="400" cy="690" rx="195" ry="32" fill="#D5CDD8" opacity="0.65"/>
    <ellipse cx="400" cy="690" rx="140" ry="18" fill="#BEB4C2" opacity="0.5"/>
  `),
  // FASE 0: Huevo entero inicial con huellita
  egg_phase0: wrapSvg(`
    <path d="M 400 180 C 260 180, 215 410, 230 545 C 245 655, 320 685, 400 685 C 480 685, 555 655, 570 545 C 585 410, 540 180, 400 180 Z" fill="url(#eggGrad)" stroke="#4A2518" stroke-width="12" stroke-linejoin="round"/>
    <ellipse cx="330" cy="285" rx="30" ry="55" transform="rotate(24 330 285)" fill="#FFFFFF" opacity="0.8"/>
    <g transform="translate(0, 15)">
      <ellipse cx="400" cy="465" rx="44" ry="36" fill="#F4A59E" stroke="#4A2518" stroke-width="6"/>
      <ellipse cx="348" cy="405" rx="18" ry="24" transform="rotate(-22 348 405)" fill="#F4A59E" stroke="#4A2518" stroke-width="6"/>
      <ellipse cx="382" cy="385" rx="18" ry="25" transform="rotate(-6 382 385)" fill="#F4A59E" stroke="#4A2518" stroke-width="6"/>
      <ellipse cx="418" cy="385" rx="18" ry="25" transform="rotate(6 418 385)" fill="#F4A59E" stroke="#4A2518" stroke-width="6"/>
      <ellipse cx="452" cy="405" rx="18" ry="24" transform="rotate(22 452 405)" fill="#F4A59E" stroke="#4A2518" stroke-width="6"/>
    </g>
  `),
  // FASE 1: Grieta leve
  egg_phase1: wrapSvg(`
    <path d="M 400 180 C 260 180, 215 410, 230 545 C 245 655, 320 685, 400 685 C 480 685, 555 655, 570 545 C 585 410, 540 180, 400 180 Z" fill="url(#eggGrad)" stroke="#4A2518" stroke-width="12" stroke-linejoin="round"/>
    <path d="M 310 320 L 340 345 L 325 375 L 355 395" fill="none" stroke="#4A2518" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="330" cy="285" rx="30" ry="55" transform="rotate(24 330 285)" fill="#FFFFFF" opacity="0.8"/>
  `),
  // FASE 2: Grietas avanzadas
  egg_phase2: wrapSvg(`
    <path d="M 400 180 C 260 180, 215 410, 230 545 C 245 655, 320 685, 400 685 C 480 685, 555 655, 570 545 C 585 410, 540 180, 400 180 Z" fill="url(#eggGrad)" stroke="#4A2518" stroke-width="12" stroke-linejoin="round"/>
    <path d="M 280 290 L 330 320 L 310 360 L 350 390 L 390 370 L 440 400 L 480 360 L 510 380" fill="none" stroke="#4A2518" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="330" cy="285" rx="30" ry="55" transform="rotate(24 330 285)" fill="#FFFFFF" opacity="0.8"/>
  `),
  // FASE 3: Nacimiento / Cascarones rotos
  egg_phase3: wrapSvg(`
    <path d="M 230 545 C 245 655, 320 685, 400 685 C 480 685, 555 655, 570 545 L 530 420 L 460 450 L 380 420 L 300 450 Z" fill="url(#eggGrad)" stroke="#4A2518" stroke-width="12" stroke-linejoin="round"/>
    <path d="M 310 280 C 350 240, 450 240, 500 290 L 440 330 L 360 300 Z" fill="url(#eggGrad)" stroke="#4A2518" stroke-width="10" stroke-linejoin="round" transform="translate(45, -35) rotate(18)"/>
  `),
  // CAPAS DEL BEBE SHIBA
  cola: wrapSvg(`
    <path d="M 475 615 C 520 650, 615 625, 620 545 C 625 475, 560 440, 520 465 C 485 485, 495 535, 530 540 C 555 542, 565 515, 545 505 C 535 500, 520 512, 510 535 C 480 550, 465 585, 475 615 Z" fill="url(#furGrad)" stroke="#4A2518" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 520 465 C 555 445, 615 475, 620 535 C 605 515, 585 525, 575 510 C 565 525, 540 520, 530 538 C 500 530, 492 485, 520 465 Z" fill="url(#creamGrad)"/>
  `),
  cuerpo: wrapSvg(`
    <path d="M 295 440 C 265 510, 260 615, 295 660 C 330 695, 470 695, 505 660 C 540 615, 535 510, 505 440 Z" fill="url(#furGrad)" stroke="#4A2518" stroke-width="10" stroke-linejoin="round"/>
    <path d="M 325 465 C 300 525, 305 625, 345 662 C 375 682, 425 682, 455 662 C 495 625, 500 525, 475 465 Z" fill="url(#creamGrad)"/>
  `),
  pata_izq: wrapSvg(`
    <path d="M 272 605 C 242 612, 232 652, 255 678 C 278 700, 332 695, 345 675 C 355 655, 340 610, 305 605 Z" fill="url(#furGrad)" stroke="#4A2518" stroke-width="10" stroke-linejoin="round"/>
    <ellipse cx="288" cy="655" rx="36" ry="34" transform="rotate(-18 288 655)" fill="url(#creamGrad)" stroke="#4A2518" stroke-width="9"/>
    <ellipse cx="288" cy="665" rx="14" ry="12" transform="rotate(-15 288 665)" fill="#F4A59E"/>
  `),
  pata_der: wrapSvg(`
    <path d="M 528 605 C 558 612, 568 652, 545 678 C 522 700, 468 695, 455 675 C 445 655, 460 610, 495 605 Z" fill="url(#furGrad)" stroke="#4A2518" stroke-width="10" stroke-linejoin="round"/>
    <ellipse cx="512" cy="655" rx="36" ry="34" transform="rotate(18 512 655)" fill="url(#creamGrad)" stroke="#4A2518" stroke-width="9"/>
    <ellipse cx="512" cy="665" rx="14" ry="12" transform="rotate(15 512 665)" fill="#F4A59E"/>
  `),
  brazo_izq: wrapSvg(`
    <path d="M 290 450 C 255 485, 258 555, 295 578 C 325 595, 360 580, 365 552 C 368 525, 342 505, 322 495 C 312 480, 310 460, 290 450 Z" fill="url(#furGrad)" stroke="#4A2518" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 322 584 C 348 588, 364 570, 365 550 C 365 530, 348 515, 330 515 C 312 528, 308 562, 322 584 Z" fill="url(#creamGrad)"/>
  `),
  brazo_der_normal: wrapSvg(`
    <path d="M 510 450 C 545 485, 542 555, 505 578 C 475 595, 440 580, 435 552 C 432 525, 458 505, 478 495 C 488 480, 490 460, 510 450 Z" fill="url(#furGrad)" stroke="#4A2518" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 478 584 C 452 588, 436 570, 435 550 C 435 530, 452 515, 470 515 C 488 528, 492 562, 478 584 Z" fill="url(#creamGrad)"/>
  `),
  brazo_der_saludo: wrapSvg(`
    <path d="M 510 450 C 560 420, 580 320, 540 280 C 520 260, 480 280, 490 320 C 510 380, 480 430, 510 450 Z" fill="url(#furGrad)" stroke="#4A2518" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="545" cy="270" rx="24" ry="20" fill="url(#creamGrad)" stroke="#4A2518" stroke-width="8"/>
    <circle cx="530" cy="255" rx="6" fill="#F4A59E" stroke="#4A2518" stroke-width="4"/>
    <circle cx="545" cy="250" rx="6" fill="#F4A59E" stroke="#4A2518" stroke-width="4"/>
    <circle cx="560" cy="255" rx="6" fill="#F4A59E" stroke="#4A2518" stroke-width="4"/>
  `),
  bufanda_ext: wrapSvg(`
    <path d="M 515 415 C 545 395, 575 365, 595 345 C 612 365, 622 390, 625 415 C 590 435, 550 448, 512 442 Z" fill="url(#scarfGrad)" stroke="#4A2518" stroke-width="10" stroke-linejoin="round"/>
  `),
  bufanda_cuello: wrapSvg(`
    <path d="M 272 395 C 258 425, 262 465, 290 478 C 350 508, 450 508, 510 478 C 538 465, 542 425, 528 395 C 465 425, 335 425, 272 395 Z" fill="url(#scarfGrad)" stroke="#4A2518" stroke-width="10" stroke-linejoin="round"/>
  `),
  cabeza: wrapSvg(`
    <path d="M 400 205 C 425 205, 445 212, 458 218 C 475 182, 502 155, 518 162 C 535 168, 548 225, 538 282 C 555 308, 562 332, 572 342 L 555 352 C 565 368, 568 382, 552 398 C 522 428, 465 442, 400 442 C 335 442, 278 428, 248 398 C 232 382, 235 368, 245 352 L 228 342 C 238 332, 245 308, 262 282 C 252 225, 265 168, 282 162 C 298 155, 325 182, 342 218 C 355 212, 375 205, 400 205 Z" fill="url(#furGrad)" stroke="#4A2518" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 282 262 C 276 225, 284 190, 294 188 C 304 186, 322 212, 330 232 C 312 240, 295 250, 282 262 Z" fill="#F4A59E"/>
    <path d="M 518 262 C 524 225, 516 190, 506 188 C 496 186, 478 212, 470 232 C 488 240, 505 250, 518 262 Z" fill="#F4A59E"/>
    <path d="M 255 375 C 262 342, 305 332, 345 348 C 368 358, 382 332, 400 332 C 418 332, 432 358, 455 348 C 495 332, 538 342, 545 375 C 550 405, 495 436, 400 436 C 305 436, 250 405, 255 375 Z" fill="url(#creamGrad)"/>
  `),
  // EXPRESIONES FACIALES
  face_sonreir: wrapSvg(`
    <ellipse cx="298" cy="366" rx="28" ry="16" fill="#FF8B82" opacity="0.85"/>
    <ellipse cx="502" cy="366" rx="28" ry="16" fill="#FF8B82" opacity="0.85"/>
    <path d="M 322 342 C 330 318, 358 318, 366 342" fill="none" stroke="#4A2518" stroke-width="12" stroke-linecap="round"/>
    <path d="M 434 342 C 442 318, 470 318, 478 342" fill="none" stroke="#4A2518" stroke-width="12" stroke-linecap="round"/>
    <path d="M 384 356 C 384 348, 416 348, 416 356 C 416 366, 406 374, 400 374 C 394 374, 384 366, 384 356 Z" fill="#4A2518"/>
    <path d="M 366 382 C 374 398, 394 398, 400 382 C 406 398, 426 398, 434 382" fill="none" stroke="#4A2518" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  `),
  face_ojos: wrapSvg(`
    <ellipse cx="298" cy="368" rx="28" ry="16" fill="#FF8B82" opacity="0.85"/>
    <ellipse cx="502" cy="368" rx="28" ry="16" fill="#FF8B82" opacity="0.85"/>
    <ellipse cx="344" cy="332" rx="20" ry="22" fill="#4A2518"/>
    <circle cx="336" cy="323" r="7.5" fill="#FFFFFF"/>
    <ellipse cx="456" cy="332" rx="20" ry="22" fill="#4A2518"/>
    <circle cx="448" cy="323" r="7.5" fill="#FFFFFF"/>
    <path d="M 384 356 C 384 348, 416 348, 416 356 C 416 366, 406 374, 400 374 C 394 374, 384 366, 384 356 Z" fill="#4A2518"/>
    <path d="M 366 382 C 374 398, 394 398, 400 382 C 406 398, 426 398, 434 382" fill="none" stroke="#4A2518" stroke-width="9" stroke-linecap="round"/>
  `),
  face_comer: wrapSvg(`
    <ellipse cx="298" cy="368" rx="28" ry="16" fill="#FF8B82" opacity="0.85"/>
    <ellipse cx="502" cy="368" rx="28" ry="16" fill="#FF8B82" opacity="0.85"/>
    <path d="M 322 342 C 330 320, 358 320, 366 342" fill="none" stroke="#4A2518" stroke-width="12" stroke-linecap="round"/>
    <path d="M 434 342 C 442 320, 470 320, 478 342" fill="none" stroke="#4A2518" stroke-width="12" stroke-linecap="round"/>
    <path d="M 384 356 C 384 348, 416 348, 416 356 C 416 366, 406 374, 400 374 C 394 374, 384 366, 384 356 Z" fill="#4A2518"/>
    <ellipse cx="400" cy="395" rx="22" ry="20" fill="#8C2D2D" stroke="#4A2518" stroke-width="7"/>
    <circle cx="400" cy="392" r="8" fill="#FF4D4D"/>
  `),
  face_llorar: wrapSvg(`
    <ellipse cx="298" cy="372" rx="28" ry="15" fill="#FF8B82" opacity="0.6"/>
    <ellipse cx="502" cy="372" rx="28" ry="15" fill="#FF8B82" opacity="0.6"/>
    <ellipse cx="344" cy="338" rx="21" ry="22" fill="#4A2518"/>
    <circle cx="336" cy="329" r="8" fill="#FFFFFF"/>
    <ellipse cx="456" cy="338" rx="21" ry="22" fill="#4A2518"/>
    <circle cx="448" cy="329" r="8" fill="#FFFFFF"/>
    <path d="M 326 355 C 314 378, 314 405, 326 410 C 338 405, 338 378, 326 355 Z" fill="#6EC6FF" stroke="#4A2518" stroke-width="5"/>
    <path d="M 474 355 C 462 378, 462 405, 474 410 C 486 405, 486 378, 474 355 Z" fill="#6EC6FF" stroke="#4A2518" stroke-width="5"/>
    <path d="M 385 358 C 385 350, 415 350, 415 358 C 415 367, 405 374, 400 374 C 395 374, 385 367, 385 358 Z" fill="#4A2518"/>
    <path d="M 374 398 Q 400 378 426 398" fill="none" stroke="#4A2518" stroke-width="9" stroke-linecap="round"/>
  `),
  face_alegre: wrapSvg(`
    <ellipse cx="295" cy="365" rx="32" ry="18" fill="#FF6B6B" opacity="0.95"/>
    <ellipse cx="505" cy="365" rx="32" ry="18" fill="#FF6B6B" opacity="0.95"/>
    <path d="M 318 338 C 328 305, 360 305, 370 338" fill="none" stroke="#4A2518" stroke-width="13" stroke-linecap="round"/>
    <path d="M 430 338 C 440 305, 472 305, 482 338" fill="none" stroke="#4A2518" stroke-width="13" stroke-linecap="round"/>
    <path d="M 384 352 C 384 344, 416 344, 416 352 C 416 362, 406 370, 400 370 C 394 370, 384 362, 384 352 Z" fill="#4A2518"/>
    <path d="M 362 376 L 438 376 C 438 412, 418 424, 400 424 C 382 424, 362 412, 362 376 Z" fill="#9E3333" stroke="#4A2518" stroke-width="8" stroke-linejoin="round"/>
  `),
};

export default function PetMascot({
  isHatched = true,
  eggPhase = 0, // 0: entero, 1: leve, 2: avanzado, 3: eclosion
  currentAnim = 'sonreir', // 'sonreir', 'saludar', 'comer', 'moverCola', 'superAlegre', 'llorar'
  mood = 'HAPPY',
  stage = 'Bebé',
  size = 250,
  onTap = () => {},
}) {
  const animTick = useRef(new Animated.Value(0)).current;

  // Lógica de animación fluida continua
  useEffect(() => {
    animTick.setValue(0);
    const isFast = currentAnim === 'superAlegre' || currentAnim === 'moverCola' || currentAnim === 'saludar';
    const duration = isFast ? 320 : 680;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(animTick, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(animTick, { toValue: -1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(animTick, { toValue: 0, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [currentAnim]);

  // Selección de SVG de huevo
  const getEggSvg = () => {
    if (eggPhase === 1) return MASCOT_SVGS.egg_phase1;
    if (eggPhase === 2) return MASCOT_SVGS.egg_phase2;
    if (eggPhase >= 3) return MASCOT_SVGS.egg_phase3;
    return MASCOT_SVGS.egg_phase0;
  };

  // Selección de cara según emoción / mood
  const getFaceSvg = () => {
    if (mood === 'SAD' && currentAnim === 'idle') return MASCOT_SVGS.face_llorar;
    switch (currentAnim) {
      case 'saludar':
      case 'abrirOjos':
        return MASCOT_SVGS.face_ojos;
      case 'comer':
        return MASCOT_SVGS.face_comer;
      case 'llorar':
        return MASCOT_SVGS.face_llorar;
      case 'superAlegre':
        return MASCOT_SVGS.face_alegre;
      default:
        return MASCOT_SVGS.face_sonreir;
    }
  };

  // Interpolaciones dinámicas
  const jumpY = animTick.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: currentAnim === 'superAlegre' ? [0, -18, 0] : [0, -4, 0],
  });

  const headRotate = animTick.interpolate({
    inputRange: [-1, 1],
    outputRange: currentAnim === 'llorar' ? ['-3deg', '3deg'] : ['-5deg', '5deg'],
  });

  const tailRotate = animTick.interpolate({
    inputRange: [-1, 1],
    outputRange: currentAnim === 'moverCola' || currentAnim === 'superAlegre' ? ['-24deg', '24deg'] : ['-7deg', '7deg'],
  });

  const rightArmRotate = animTick.interpolate({
    inputRange: [-1, 1],
    outputRange: currentAnim === 'saludar' ? ['-16deg', '16deg'] : ['-3deg', '3deg'],
  });

  const leftArmRotate = animTick.interpolate({
    inputRange: [-1, 1],
    outputRange: ['3deg', '-3deg'],
  });

  const eggRotate = animTick.interpolate({
    inputRange: [-1, 1],
    outputRange: eggPhase > 0 ? ['-10deg', '10deg'] : ['-3deg', '3deg'],
  });

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onTap} style={[styles.container, { width: size, height: size }]}>
      <View style={styles.canvas}>
        {/* Sombra base */}
        <View style={styles.layer}>
          <SvgXml xml={MASCOT_SVGS.sombra} width={size} height={size} />
        </View>

        {!isHatched ? (
          /* ESCENA HUEVO */
          <Animated.View style={[styles.layer, { transform: [{ rotate: eggRotate }, { translateY: jumpY }] }]}>
            <View style={styles.layer}>
              <SvgXml xml={getEggSvg()} width={size} height={size} />
            </View>
          </Animated.View>
        ) : (
          /* ESCENA SHIBA INU BEBÉ */
          <Animated.View style={[styles.layer, { transform: [{ translateY: jumpY }] }]}>
            {/* Cola */}
            <Animated.View style={[styles.layer, { transform: [{ rotate: tailRotate }] }]}>
              <SvgXml xml={MASCOT_SVGS.cola} width={size} height={size} />
            </Animated.View>

            {/* Torso */}
            <View style={styles.layer}>
              <SvgXml xml={MASCOT_SVGS.cuerpo} width={size} height={size} />
            </View>

            {/* Patas */}
            <View style={styles.layer}>
              <SvgXml xml={MASCOT_SVGS.pata_izq} width={size} height={size} />
            </View>
            <View style={styles.layer}>
              <SvgXml xml={MASCOT_SVGS.pata_der} width={size} height={size} />
            </View>

            {/* Brazo izquierdo */}
            <Animated.View style={[styles.layer, { transform: [{ rotate: leftArmRotate }] }]}>
              <SvgXml xml={MASCOT_SVGS.brazo_izq} width={size} height={size} />
            </Animated.View>

            {/* Brazo derecho (Saludando o descansando en la panza) */}
            <Animated.View style={[styles.layer, { transform: [{ rotate: rightArmRotate }] }]}>
              <SvgXml
                xml={currentAnim === 'saludar' ? MASCOT_SVGS.brazo_der_saludo : MASCOT_SVGS.brazo_der_normal}
                width={size}
                height={size}
              />
            </Animated.View>

            {/* Bufanda verde */}
            <View style={styles.layer}>
              <SvgXml xml={MASCOT_SVGS.bufanda_ext} width={size} height={size} />
            </View>
            <View style={styles.layer}>
              <SvgXml xml={MASCOT_SVGS.bufanda_cuello} width={size} height={size} />
            </View>

            {/* Cabeza y expresión facial */}
            <Animated.View style={[styles.layer, { transform: [{ rotate: headRotate }] }]}>
              <View style={styles.layer}>
                <SvgXml xml={MASCOT_SVGS.cabeza} width={size} height={size} />
              </View>
              <View style={styles.layer}>
                <SvgXml xml={getFaceSvg()} width={size} height={size} />
              </View>
            </Animated.View>
          </Animated.View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});
