import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Animated, Easing } from "react-native";
import { SvgXml } from "react-native-svg";

const STAGE_SIZE = 280;

const DEFS = `
  <defs>
    <linearGradient id="furGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFD08A"/>
      <stop offset="55%" stop-color="#F69B42"/>
      <stop offset="100%" stop-color="#D97425"/>
    </linearGradient>
    <linearGradient id="creamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFCF4"/>
      <stop offset="100%" stop-color="#F5DFB5"/>
    </linearGradient>
    <linearGradient id="scarfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5DD496"/>
      <stop offset="55%" stop-color="#2E8C5E"/>
      <stop offset="100%" stop-color="#1A5C3A"/>
    </linearGradient>
    <linearGradient id="eggGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="70%" stop-color="#F4E2C8"/>
      <stop offset="100%" stop-color="#DCC8A0"/>
    </linearGradient>
    <radialGradient id="eyeL" cx="38%" cy="32%" r="58%">
      <stop offset="0%" stop-color="#5535AA"/>
      <stop offset="50%" stop-color="#1E0E4A"/>
      <stop offset="100%" stop-color="#0A0520"/>
    </radialGradient>
    <radialGradient id="eyeR" cx="62%" cy="32%" r="58%">
      <stop offset="0%" stop-color="#5535AA"/>
      <stop offset="50%" stop-color="#1E0E4A"/>
      <stop offset="100%" stop-color="#0A0520"/>
    </radialGradient>
    <radialGradient id="cheekGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF8FAA" stop-opacity="0.95"/>
      <stop offset="60%" stop-color="#FF6080" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#FF4060" stop-opacity="0.0"/>
    </radialGradient>
    <radialGradient id="noseGrad" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#7A4040"/>
      <stop offset="100%" stop-color="#2E1010"/>
    </radialGradient>
  </defs>
`;

const wrapSvg = (c) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">${DEFS}${c}</svg>`;

const EYES_N = `
  <ellipse cx="316" cy="294" rx="40" ry="44" fill="#18083A"/>
  <ellipse cx="316" cy="294" rx="36" ry="40" fill="url(#eyeL)"/>
  <ellipse cx="304" cy="280" rx="13" ry="15" fill="#7050C0" opacity="0.55"/>
  <ellipse cx="302" cy="276" rx="9" ry="10" fill="#FFFFFF" opacity="0.98"/>
  <circle cx="330" cy="308" r="5" fill="#FFFFFF" opacity="0.7"/>
  <ellipse cx="484" cy="294" rx="40" ry="44" fill="#18083A"/>
  <ellipse cx="484" cy="294" rx="36" ry="40" fill="url(#eyeR)"/>
  <ellipse cx="472" cy="280" rx="13" ry="15" fill="#7050C0" opacity="0.55"/>
  <ellipse cx="470" cy="276" rx="9" ry="10" fill="#FFFFFF" opacity="0.98"/>
  <circle cx="498" cy="308" r="5" fill="#FFFFFF" opacity="0.7"/>
`;
const EYES_H = `
  <path d="M 282 288 C 292 262, 322 256, 352 272 C 348 294, 326 308, 300 302 Z" fill="#18083A"/>
  <path d="M 448 288 C 458 262, 488 256, 518 272 C 514 294, 492 308, 466 302 Z" fill="#18083A"/>
`;
const EYES_S = `
  <ellipse cx="316" cy="300" rx="38" ry="42" fill="#18083A"/>
  <ellipse cx="316" cy="300" rx="34" ry="38" fill="url(#eyeL)"/>
  <ellipse cx="305" cy="287" rx="11" ry="13" fill="#6048B0" opacity="0.5"/>
  <ellipse cx="303" cy="284" rx="8" ry="9" fill="#FFFFFF" opacity="0.9"/>
  <path d="M 282 256 C 296 268, 330 268, 346 254" fill="none" stroke="#3A1A08" stroke-width="8" stroke-linecap="round"/>
  <ellipse cx="484" cy="300" rx="38" ry="42" fill="#18083A"/>
  <ellipse cx="484" cy="300" rx="34" ry="38" fill="url(#eyeR)"/>
  <ellipse cx="473" cy="287" rx="11" ry="13" fill="#6048B0" opacity="0.5"/>
  <ellipse cx="471" cy="284" rx="8" ry="9" fill="#FFFFFF" opacity="0.9"/>
  <path d="M 454 254 C 470 268, 504 268, 518 256" fill="none" stroke="#3A1A08" stroke-width="8" stroke-linecap="round"/>
`;
const CHEEKS = `<ellipse cx="262" cy="360" rx="44" ry="30" fill="url(#cheekGrad)"/><ellipse cx="538" cy="360" rx="44" ry="30" fill="url(#cheekGrad)"/>`;
const BIGCHK = `<ellipse cx="255" cy="358" rx="54" ry="36" fill="url(#cheekGrad)" opacity="0.92"/><ellipse cx="545" cy="358" rx="54" ry="36" fill="url(#cheekGrad)" opacity="0.92"/>`;
const NOSE   = `<ellipse cx="400" cy="358" rx="20" ry="13" fill="url(#noseGrad)"/><ellipse cx="394" cy="353" rx="7" ry="5" fill="#8A5050" opacity="0.55"/>`;
const SMILE  = `<path d="M 372 378 C 382 394, 394 398, 400 398 C 406 398, 418 394, 428 378" fill="none" stroke="#3A1A08" stroke-width="9" stroke-linecap="round"/>`;
const BIGMTH = `<path d="M 364 376 L 436 376 C 436 412, 418 426, 400 426 C 382 426, 364 412, 364 376 Z" fill="#A03030" stroke="#3A1A08" stroke-width="7"/><ellipse cx="400" cy="400" rx="20" ry="11" fill="#CC4848" opacity="0.65"/>`;
const SADMTH = `<path d="M 374 396 C 384 380, 398 375, 400 375 C 402 375, 416 380, 426 396" fill="none" stroke="#3A1A08" stroke-width="9" stroke-linecap="round"/>`;
const BROW_H = `<path d="M 284 255 C 298 244, 334 244, 350 255" fill="none" stroke="#3A1A08" stroke-width="7" stroke-linecap="round"/><path d="M 450 255 C 466 244, 502 244, 516 255" fill="none" stroke="#3A1A08" stroke-width="7" stroke-linecap="round"/>`;
const BROW_S = `<path d="M 284 255 C 298 266, 334 266, 350 255" fill="none" stroke="#3A1A08" stroke-width="7" stroke-linecap="round"/><path d="M 450 255 C 466 266, 502 266, 516 255" fill="none" stroke="#3A1A08" stroke-width="7" stroke-linecap="round"/>`;

const SVGS = {
  sombra: wrapSvg(`<ellipse cx="400" cy="696" rx="215" ry="26" fill="#C8C0CE" opacity="0.5"/><ellipse cx="400" cy="696" rx="150" ry="15" fill="#B0A8B8" opacity="0.38"/>`),
  egg_phase0: wrapSvg(`
    <ellipse cx="400" cy="692" rx="190" ry="20" fill="#C8C0CE" opacity="0.38"/>
    <path d="M 400 162 C 244 162, 196 404, 215 554 C 232 664, 318 695, 400 695 C 482 695, 568 664, 585 554 C 604 404, 556 162, 400 162 Z" fill="url(#eggGrad)" stroke="#3A1A08" stroke-width="11" stroke-linejoin="round"/>
    <ellipse cx="340" cy="272" rx="26" ry="58" transform="rotate(22 340 272)" fill="#FFFFFF" opacity="0.68"/>
    <ellipse cx="358" cy="260" rx="9" ry="26" transform="rotate(22 358 260)" fill="#FFFFFF" opacity="0.45"/>
    <g transform="translate(0,20)">
      <ellipse cx="400" cy="468" rx="48" ry="40" fill="#F2A09A" stroke="#3A1A08" stroke-width="5.5"/>
      <ellipse cx="346" cy="408" rx="18" ry="26" transform="rotate(-22 346 408)" fill="#F2A09A" stroke="#3A1A08" stroke-width="5"/>
      <ellipse cx="382" cy="386" rx="18" ry="27" transform="rotate(-7 382 386)" fill="#F2A09A" stroke="#3A1A08" stroke-width="5"/>
      <ellipse cx="418" cy="386" rx="18" ry="27" transform="rotate(7 418 386)" fill="#F2A09A" stroke="#3A1A08" stroke-width="5"/>
      <ellipse cx="454" cy="408" rx="18" ry="26" transform="rotate(22 454 408)" fill="#F2A09A" stroke="#3A1A08" stroke-width="5"/>
    </g>
  `),
  egg_phase1: wrapSvg(`
    <ellipse cx="400" cy="692" rx="190" ry="20" fill="#C8C0CE" opacity="0.38"/>
    <path d="M 400 162 C 244 162, 196 404, 215 554 C 232 664, 318 695, 400 695 C 482 695, 568 664, 585 554 C 604 404, 556 162, 400 162 Z" fill="url(#eggGrad)" stroke="#3A1A08" stroke-width="11" stroke-linejoin="round"/>
    <path d="M 314 316 L 346 346 L 328 380 L 360 402 L 374 384" fill="none" stroke="#3A1A08" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 316 320 L 344 346 L 330 376 L 358 398" fill="#EACDA0" stroke="none" opacity="0.55"/>
    <ellipse cx="340" cy="272" rx="26" ry="58" transform="rotate(22 340 272)" fill="#FFFFFF" opacity="0.68"/>
  `),
  egg_phase2: wrapSvg(`
    <ellipse cx="400" cy="692" rx="190" ry="20" fill="#C8C0CE" opacity="0.38"/>
    <path d="M 400 162 C 244 162, 196 404, 215 554 C 232 664, 318 695, 400 695 C 482 695, 568 664, 585 554 C 604 404, 556 162, 400 162 Z" fill="url(#eggGrad)" stroke="#3A1A08" stroke-width="11" stroke-linejoin="round"/>
    <path d="M 276 288 L 332 322 L 308 366 L 356 398 L 400 374 L 448 404 L 490 362 L 522 385" fill="none" stroke="#3A1A08" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 356 398 L 355 446 L 370 460" fill="none" stroke="#3A1A08" stroke-width="7" stroke-linecap="round"/>
    <path d="M 400 374 L 401 334 L 415 312" fill="none" stroke="#3A1A08" stroke-width="6" stroke-linecap="round"/>
    <ellipse cx="340" cy="272" rx="26" ry="58" transform="rotate(22 340 272)" fill="#FFFFFF" opacity="0.62"/>
  `),
  egg_phase3: wrapSvg(`
    <ellipse cx="400" cy="692" rx="190" ry="20" fill="#C8C0CE" opacity="0.38"/>
    <path d="M 215 554 C 232 664, 318 695, 400 695 C 482 695, 568 664, 585 554 L 538 414 L 462 452 L 378 415 L 300 454 Z" fill="url(#eggGrad)" stroke="#3A1A08" stroke-width="10" stroke-linejoin="round"/>
    <path d="M 296 292 C 340 244, 456 240, 504 298 L 442 334 L 360 300 Z" fill="url(#eggGrad)" stroke="#3A1A08" stroke-width="9" stroke-linejoin="round" transform="translate(54,-42) rotate(21 400 300)"/>
    <path d="M 236 198 L 246 198 M 241 193 L 241 203" stroke="#FFD700" stroke-width="5" stroke-linecap="round"/>
    <path d="M 562 175 L 574 175 M 568 170 L 568 180" stroke="#FFD700" stroke-width="5" stroke-linecap="round"/>
  `),
  cola: wrapSvg(`
    <path d="M 470 620 C 488 664, 548 686, 614 664 C 660 644, 672 594, 656 546 C 642 504, 604 482, 570 494 C 540 504, 528 540, 554 558 C 572 570, 590 554, 576 540 C 562 528, 540 532, 528 552 C 506 578, 492 604, 470 620 Z" fill="url(#furGrad)" stroke="#3A1A08" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 570 494 C 614 474, 656 506, 656 550 C 640 528, 618 534, 606 518 C 592 536, 566 534, 556 554 C 526 546, 520 496, 570 494 Z" fill="url(#creamGrad)" opacity="0.92"/>
    <path d="M 537 562 C 546 548, 562 546, 571 556" fill="none" stroke="#C07030" stroke-width="4" stroke-linecap="round" opacity="0.55"/>
  `),
  cuerpo: wrapSvg(`
    <path d="M 288 452 C 248 524, 244 632, 288 674 C 328 708, 472 708, 512 674 C 556 632, 552 524, 512 452 Z" fill="url(#furGrad)" stroke="#3A1A08" stroke-width="10" stroke-linejoin="round"/>
    <ellipse cx="400" cy="596" rx="95" ry="108" fill="url(#creamGrad)" opacity="0.96"/>
    <path d="M 268 572 C 282 550, 318 556, 332 586" fill="none" stroke="#3A1A08" stroke-width="7.5" stroke-linecap="round"/>
    <path d="M 532 572 C 518 550, 482 556, 468 586" fill="none" stroke="#3A1A08" stroke-width="7.5" stroke-linecap="round"/>
    <ellipse cx="385" cy="548" rx="26" ry="19" fill="#FFFFFF" opacity="0.28"/>
  `),
  pata_izq: wrapSvg(`
    <path d="M 264 614 C 230 624, 218 666, 245 692 C 270 714, 336 708, 350 684 C 362 660, 346 618, 306 610 Z" fill="url(#furGrad)" stroke="#3A1A08" stroke-width="10" stroke-linejoin="round"/>
    <ellipse cx="280" cy="667" rx="42" ry="37" transform="rotate(-16 280 667)" fill="url(#creamGrad)" stroke="#3A1A08" stroke-width="7.5"/>
    <ellipse cx="280" cy="676" rx="16" ry="14" transform="rotate(-12 280 676)" fill="#F2A09A"/>
    <ellipse cx="256" cy="655" rx="7.5" ry="10" transform="rotate(-34 256 655)" fill="#F2A09A"/>
    <ellipse cx="274" cy="644" rx="7.5" ry="10" transform="rotate(-12 274 644)" fill="#F2A09A"/>
    <ellipse cx="296" cy="646" rx="7.5" ry="10" transform="rotate(10 296 646)" fill="#F2A09A"/>
  `),
  pata_der: wrapSvg(`
    <path d="M 536 614 C 570 624, 582 666, 555 692 C 530 714, 464 708, 450 684 C 438 660, 454 618, 494 610 Z" fill="url(#furGrad)" stroke="#3A1A08" stroke-width="10" stroke-linejoin="round"/>
    <ellipse cx="520" cy="667" rx="42" ry="37" transform="rotate(16 520 667)" fill="url(#creamGrad)" stroke="#3A1A08" stroke-width="7.5"/>
    <ellipse cx="520" cy="676" rx="16" ry="14" transform="rotate(12 520 676)" fill="#F2A09A"/>
    <ellipse cx="544" cy="655" rx="7.5" ry="10" transform="rotate(34 544 655)" fill="#F2A09A"/>
    <ellipse cx="526" cy="644" rx="7.5" ry="10" transform="rotate(12 526 644)" fill="#F2A09A"/>
    <ellipse cx="504" cy="646" rx="7.5" ry="10" transform="rotate(-10 504 646)" fill="#F2A09A"/>
  `),
  brazo_izq: wrapSvg(`
    <path d="M 276 458 C 238 496, 240 572, 282 598 C 316 616, 360 600, 366 568 C 370 538, 340 516, 318 504 C 306 488, 302 468, 276 458 Z" fill="url(#furGrad)" stroke="#3A1A08" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="320" cy="600" rx="36" ry="32" fill="url(#creamGrad)" stroke="#3A1A08" stroke-width="7"/>
    <ellipse cx="320" cy="608" rx="14" ry="12" fill="#F2A09A"/>
    <path d="M 354 550 C 342 554, 336 558, 330 565" fill="none" stroke="#3A1A08" stroke-width="5" stroke-linecap="round"/>
    <path d="M 350 570 C 338 574, 332 577, 326 582" fill="none" stroke="#3A1A08" stroke-width="5" stroke-linecap="round"/>
  `),
  brazo_der_normal: wrapSvg(`
    <path d="M 524 458 C 562 496, 560 572, 518 598 C 484 616, 440 600, 434 568 C 430 538, 460 516, 482 504 C 494 488, 498 468, 524 458 Z" fill="url(#furGrad)" stroke="#3A1A08" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="480" cy="600" rx="36" ry="32" fill="url(#creamGrad)" stroke="#3A1A08" stroke-width="7"/>
    <ellipse cx="480" cy="608" rx="14" ry="12" fill="#F2A09A"/>
    <path d="M 446 550 C 458 554, 464 558, 470 565" fill="none" stroke="#3A1A08" stroke-width="5" stroke-linecap="round"/>
    <path d="M 450 570 C 462 574, 468 577, 474 582" fill="none" stroke="#3A1A08" stroke-width="5" stroke-linecap="round"/>
  `),
  brazo_der_saludo: wrapSvg(`
    <path d="M 524 462 C 574 430, 600 322, 556 278 C 534 255, 490 274, 498 320 C 512 372, 492 432, 524 462 Z" fill="url(#furGrad)" stroke="#3A1A08" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="558" cy="268" rx="32" ry="28" fill="url(#creamGrad)" stroke="#3A1A08" stroke-width="8"/>
    <circle cx="538" cy="249" r="9" fill="#F2A09A" stroke="#3A1A08" stroke-width="4"/>
    <circle cx="558" cy="242" r="9" fill="#F2A09A" stroke="#3A1A08" stroke-width="4"/>
    <circle cx="578" cy="249" r="9" fill="#F2A09A" stroke="#3A1A08" stroke-width="4"/>
    <ellipse cx="558" cy="268" rx="15" ry="11" fill="#F2A09A" opacity="0.55"/>
  `),
  bufanda_ext: wrapSvg(`
    <path d="M 512 422 C 546 398, 578 366, 600 344 C 620 368, 632 396, 634 424 C 598 446, 556 460, 510 452 Z" fill="url(#scarfGrad)" stroke="#3A1A08" stroke-width="10" stroke-linejoin="round"/>
    <path d="M 573 368 C 590 390, 600 415, 603 438" fill="none" stroke="#88DDAA" stroke-width="5" stroke-linecap="round" opacity="0.65"/>
  `),
  bufanda_cuello: wrapSvg(`
    <path d="M 265 404 C 248 438, 252 480, 284 494 C 348 526, 452 526, 516 494 C 548 480, 552 438, 535 404 C 470 436, 330 436, 265 404 Z" fill="url(#scarfGrad)" stroke="#3A1A08" stroke-width="10" stroke-linejoin="round"/>
    <path d="M 268 404 C 264 430, 278 454, 324 466 C 388 482, 454 476, 528 448 C 542 434, 542 416, 533 404 C 468 436, 332 436, 268 404 Z" fill="#5DD496" stroke="#3A1A08" stroke-width="7.5" stroke-linejoin="round"/>
    <path d="M 272 437 C 332 476, 456 472, 528 448" fill="none" stroke="#3A1A08" stroke-width="6.5" stroke-linecap="round"/>
  `),
  cabeza: wrapSvg(`
    <ellipse cx="400" cy="446" rx="170" ry="18" fill="#3A1A08" opacity="0.07"/>
    <path d="M 400 142 C 420 142, 442 148, 460 158 C 480 118, 512 88, 532 96 C 552 104, 566 170, 554 236 C 576 268, 586 300, 598 314 L 576 326 C 590 348, 592 370, 574 392 C 538 430, 474 450, 400 450 C 326 450, 262 430, 226 392 C 208 370, 210 348, 224 326 L 202 314 C 214 300, 224 268, 246 236 C 234 170, 248 104, 268 96 C 288 88, 320 118, 340 158 C 358 148, 380 142, 400 142 Z" fill="url(#furGrad)" stroke="#3A1A08" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 246 228 C 238 184, 248 140, 262 138 C 276 136, 298 168, 308 196 C 287 208, 265 218, 246 228 Z" fill="#F2A09A"/>
    <path d="M 554 228 C 562 184, 552 140, 538 138 C 524 136, 502 168, 492 196 C 513 208, 535 218, 554 228 Z" fill="#F2A09A"/>
    <path d="M 230 380 C 238 340, 292 324, 342 346 C 368 358, 384 326, 400 326 C 416 326, 432 358, 458 346 C 508 324, 562 340, 570 380 C 576 416, 512 450, 400 450 C 288 450, 224 416, 230 380 Z" fill="url(#creamGrad)"/>
    <ellipse cx="352" cy="178" rx="23" ry="44" transform="rotate(18 352 178)" fill="#FFFFFF" opacity="0.42"/>
    <ellipse cx="364" cy="168" rx="8" ry="20" transform="rotate(18 364 168)" fill="#FFFFFF" opacity="0.3"/>
  `),
  face_sonreir: wrapSvg(`${CHEEKS}${EYES_N}${NOSE}${SMILE}${BROW_H}`),
  face_ojos:    wrapSvg(`${CHEEKS}${EYES_N}${NOSE}${SMILE}<path d="M 288 252 C 302 243, 332 244, 348 253" fill="none" stroke="#3A1A08" stroke-width="7" stroke-linecap="round"/><path d="M 452 253 C 468 244, 498 243, 512 252" fill="none" stroke="#3A1A08" stroke-width="7" stroke-linecap="round"/>`),
  face_comer:   wrapSvg(`${CHEEKS}${EYES_H}${NOSE}<ellipse cx="400" cy="396" rx="28" ry="24" fill="#8C2828" stroke="#3A1A08" stroke-width="7"/><ellipse cx="400" cy="390" rx="12" ry="10" fill="#FF5050" opacity="0.9"/>${BROW_H}`),
  face_llorar:  wrapSvg(`<ellipse cx="262" cy="360" rx="40" ry="26" fill="url(#cheekGrad)" opacity="0.38"/><ellipse cx="538" cy="360" rx="40" ry="26" fill="url(#cheekGrad)" opacity="0.38"/>${EYES_S}${NOSE}${SADMTH}<path d="M 298 338 C 284 368, 282 402, 298 410 C 314 402, 314 368, 298 338 Z" fill="#6EC6FF" stroke="#3A1A08" stroke-width="4"/><path d="M 502 338 C 488 368, 486 402, 502 410 C 518 402, 518 368, 502 338 Z" fill="#6EC6FF" stroke="#3A1A08" stroke-width="4"/>${BROW_S}`),
  face_alegre:  wrapSvg(`${BIGCHK}${EYES_H}${NOSE}${BIGMTH}${BROW_H}`),
};

const EMOTION_BUTTONS = [
  { key: "saludar",    label: "Saludar" },
  { key: "comer",      label: "Comer" },
  { key: "moverCola",  label: "Mover Cola" },
  { key: "sonreir",    label: "Sonreir" },
  { key: "llorar",     label: "Triste" },
  { key: "superAlegre",label: "Super Alegre" },
];

export default function App() {
  const [expenses, setExpenses]           = useState([]);
  const [desc, setDesc]                   = useState("");
  const [amount, setAmount]               = useState("");
  const [currentAnim, setCurrentAnim]     = useState("sonreir");
  const [statusMessage, setStatusMessage] = useState("Huevo Etapa 0! Registra tus primeros 3 gastos para eclosionar tu mascota.");

  const tailAnim   = useRef(new Animated.Value(0)).current;
  const headAnim   = useRef(new Animated.Value(0)).current;
  const breathAnim = useRef(new Animated.Value(0)).current;
  const armAnim    = useRef(new Animated.Value(0)).current;
  const eggAnim    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    [tailAnim, headAnim, breathAnim, armAnim].forEach(v => v.setValue(0));
    const isSuperHappy = currentAnim === "superAlegre";
    const isWag        = currentAnim === "moverCola";
    const isWave       = currentAnim === "saludar";
    const tS = (isSuperHappy || isWag) ? 190 : 580;
    const hS = isSuperHappy ? 360 : 880;
    const bS = isSuperHappy ? 400 : 1050;
    const aS = isWave ? 260 : 720;

    const tl = Animated.loop(Animated.sequence([
      Animated.timing(tailAnim, { toValue: 1,  duration: tS,        easing: Easing.out(Easing.sin),   useNativeDriver: true }),
      Animated.timing(tailAnim, { toValue: -1, duration: tS,        easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(tailAnim, { toValue: 0,  duration: tS * 0.45, easing: Easing.in(Easing.sin),    useNativeDriver: true }),
    ]));
    const hl = Animated.loop(Animated.sequence([
      Animated.timing(headAnim, { toValue: 1,  duration: hS,        easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(headAnim, { toValue: -1, duration: hS,        easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(headAnim, { toValue: 0,  duration: hS * 0.55, easing: Easing.inOut(Easing.sin),  useNativeDriver: true }),
    ]));
    const bl = Animated.loop(Animated.sequence([
      Animated.timing(breathAnim, { toValue: 1, duration: bS,        easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(breathAnim, { toValue: 0, duration: bS * 1.25, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    const al = Animated.loop(Animated.sequence([
      Animated.timing(armAnim, { toValue: 1, duration: aS, easing: isWave ? Easing.out(Easing.back(2)) : Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(armAnim, { toValue: 0, duration: aS, easing: Easing.in(Easing.sin), useNativeDriver: true }),
    ]));
    [tl, hl, bl, al].forEach(l => l.start());
    return () => [tl, hl, bl, al].forEach(l => l.stop());
  }, [currentAnim]);

  useEffect(() => {
    eggAnim.setValue(0);
    const active = expenses.length > 0 && expenses.length < 3;
    const spd    = active ? 320 : 880;
    const loop   = Animated.loop(Animated.sequence([
      Animated.timing(eggAnim, { toValue: 1,  duration: spd,        easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(eggAnim, { toValue: -1, duration: spd,        easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(eggAnim, { toValue: 0,  duration: spd * 0.45, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [expenses.length]);

  const count     = expenses.length;
  const isHatched = count >= 3;

  const handleAddExpense = () => {
    const numAmount = parseFloat(amount);
    if (!desc.trim() || isNaN(numAmount) || numAmount <= 0) return;
    const newExpenses = [{ id: Date.now().toString(), desc, amount: numAmount }, ...expenses];
    setExpenses(newExpenses);
    setDesc(""); setAmount("");
    const n = newExpenses.length;
    if      (n === 1) { setCurrentAnim("sonreir");    setStatusMessage("Huevo Etapa 1! Aparecio una grieta. Faltan 2 gastos."); }
    else if (n === 2) { setCurrentAnim("sonreir");    setStatusMessage("Huevo Etapa 2! A punto de romperse. 1 gasto mas!"); }
    else if (n === 3) { setCurrentAnim("comer");      setStatusMessage("ECLOSION! Tu Bebe Shiba Inu ha nacido y come su manzana dorada!"); }
    else              { setCurrentAnim("superAlegre");setStatusMessage("Gasto registrado! Tu mascota bebe celebra con alegria."); }
  };

  const handleResetEgg = () => {
    setExpenses([]); setCurrentAnim("sonreir");
    setStatusMessage("Huevo reiniciado! Registra 3 gastos para que nazca tu mascota.");
  };

  const getEggSvg = () => {
    if (count === 1) return SVGS.egg_phase1;
    if (count === 2) return SVGS.egg_phase2;
    if (count >= 3)  return SVGS.egg_phase3;
    return SVGS.egg_phase0;
  };
  const getFaceSvg = () => {
    switch (currentAnim) {
      case "saludar": case "abrirOjos": return SVGS.face_ojos;
      case "comer":        return SVGS.face_comer;
      case "llorar":       return SVGS.face_llorar;
      case "superAlegre":  return SVGS.face_alegre;
      default:             return SVGS.face_sonreir;
    }
  };

  const isSH = currentAnim === "superAlegre";
  const isW  = currentAnim === "moverCola";
  const isWv = currentAnim === "saludar";
  const jumpY     = breathAnim.interpolate({ inputRange: [0,1], outputRange: [0, isSH ? -20 : -6] });
  const scaleY    = breathAnim.interpolate({ inputRange: [0,1], outputRange: [1, isSH ? 1.045 : 1.02] });
  const headR     = headAnim.interpolate({ inputRange: [-1,0,1], outputRange: ["-6deg","0deg","6deg"] });
  const tailR     = tailAnim.interpolate({ inputRange: [-1,0,1], outputRange: (isW||isSH) ? ["-30deg","0deg","30deg"] : ["-10deg","0deg","10deg"] });
  const leftAR    = armAnim.interpolate({ inputRange: [0,1], outputRange: ["0deg","-9deg"] });
  const rightAR   = armAnim.interpolate({ inputRange: [0,1], outputRange: ["0deg", isWv ? "20deg" : "9deg"] });
  const eggR      = eggAnim.interpolate({ inputRange: [-1,0,1], outputRange: count>0 ? ["-15deg","0deg","15deg"] : ["-4deg","0deg","4deg"] });

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS==="ios"?"padding":"height"} style={{flex:1}}>
        <ScrollView contentContainerStyle={s.container}>
          <Text style={s.title}>MetaFin</Text>
          <Text style={s.sub}>Tamagotchi Financial Companion</Text>
          <View style={s.progCard}>
            <Text style={s.progTxt}>{isHatched ? `Mascota Activa - ${expenses.length} gastos` : `Eclosion: ${expenses.length} / 3`}</Text>
            <View style={s.progBg}><View style={[s.progFill, {width:`${Math.min((expenses.length/3)*100,100)}%`}]}/></View>
          </View>
          <View style={s.stage}>
            <View style={s.canvas}>
              <View style={s.layer}><SvgXml xml={SVGS.sombra} width={STAGE_SIZE} height={STAGE_SIZE}/></View>
              {!isHatched ? (
                <Animated.View style={[s.layer,{transform:[{rotate:eggR},{translateY:jumpY}]}]}>
                  <View style={s.layer}><SvgXml xml={getEggSvg()} width={STAGE_SIZE} height={STAGE_SIZE}/></View>
                </Animated.View>
              ) : (
                <Animated.View style={[s.layer,{transform:[{translateY:jumpY}]}]}>
                  <Animated.View style={[s.layer,{transform:[{translateX:90},{translateY:78},{rotate:tailR},{translateX:-90},{translateY:-78}]}]}>
                    <SvgXml xml={SVGS.cola} width={STAGE_SIZE} height={STAGE_SIZE}/>
                  </Animated.View>
                  <Animated.View style={[s.layer,{transform:[{scaleY:scaleY}]}]}>
                    <SvgXml xml={SVGS.cuerpo} width={STAGE_SIZE} height={STAGE_SIZE}/>
                  </Animated.View>
                  <View style={s.layer}><SvgXml xml={SVGS.pata_izq} width={STAGE_SIZE} height={STAGE_SIZE}/></View>
                  <View style={s.layer}><SvgXml xml={SVGS.pata_der} width={STAGE_SIZE} height={STAGE_SIZE}/></View>
                  <Animated.View style={[s.layer,{transform:[{translateX:-102},{translateY:64},{rotate:leftAR},{translateX:102},{translateY:-64}]}]}>
                    <SvgXml xml={SVGS.brazo_izq} width={STAGE_SIZE} height={STAGE_SIZE}/>
                  </Animated.View>
                  <Animated.View style={[s.layer,{transform:[{translateX:102},{translateY:64},{rotate:rightAR},{translateX:-102},{translateY:-64}]}]}>
                    <SvgXml xml={isWv ? SVGS.brazo_der_saludo : SVGS.brazo_der_normal} width={STAGE_SIZE} height={STAGE_SIZE}/>
                  </Animated.View>
                  <View style={s.layer}><SvgXml xml={SVGS.bufanda_ext}    width={STAGE_SIZE} height={STAGE_SIZE}/></View>
                  <View style={s.layer}><SvgXml xml={SVGS.bufanda_cuello} width={STAGE_SIZE} height={STAGE_SIZE}/></View>
                  <Animated.View style={[s.layer,{transform:[{translateY:56},{rotate:headR},{translateY:-56}]}]}>
                    <View style={s.layer}><SvgXml xml={SVGS.cabeza}    width={STAGE_SIZE} height={STAGE_SIZE}/></View>
                    <View style={s.layer}><SvgXml xml={getFaceSvg()}   width={STAGE_SIZE} height={STAGE_SIZE}/></View>
                  </Animated.View>
                </Animated.View>
              )}
            </View>
            <Text style={s.status}>{statusMessage}</Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardTitle}>Tazones de Alimento</Text>
            <View style={s.bowls}>
              <View style={s.bowl}><Text style={s.bowlE}>&#x1F357;</Text><Text style={s.bowlT}>Comidas</Text></View>
              <View style={s.bowl}><Text style={s.bowlE}>&#x1F68C;</Text><Text style={s.bowlT}>Pasajes</Text></View>
              <View style={s.bowl}><Text style={s.bowlE}>&#x1F39F;&#xFE0F;</Text><Text style={s.bowlT}>Diversion</Text></View>
              <View style={s.bowl}><Text style={s.bowlE}>&#x1F9EA;</Text><Text style={s.bowlT}>Salud</Text></View>
            </View>
          </View>
          <View style={s.card}>
            <Text style={s.cardTitle}>Acciones del Bebe Shiba:</Text>
            <View style={s.btnGrid}>
              {EMOTION_BUTTONS.map(btn => (
                <TouchableOpacity key={btn.key} style={[s.btn, currentAnim===btn.key&&s.btnA]}
                  onPress={()=>{setCurrentAnim(btn.key);setStatusMessage("Accion: "+btn.label);}}>
                  <Text style={[s.btnTxt, currentAnim===btn.key&&s.btnTxtA]}>{btn.label}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={s.resetBtn} onPress={handleResetEgg}>
                <Text style={s.resetTxt}>Reiniciar Huevo</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={s.card}>
            <Text style={s.cardTitle}>Registrar Nuevo Gasto</Text>
            <View style={s.row}>
              <TextInput style={[s.input,{flex:2}]} placeholder="Almuerzo, Taxi..." value={desc} onChangeText={setDesc}/>
              <TextInput style={[s.input,{flex:1}]} placeholder="Monto" keyboardType="numeric" value={amount} onChangeText={setAmount}/>
            </View>
            <TouchableOpacity style={s.regBtn} onPress={handleAddExpense}>
              <Text style={s.regTxt}>+ Registrar Gasto</Text>
            </TouchableOpacity>
          </View>
          {expenses.length > 0 && (
            <View style={s.card}>
              <Text style={s.cardTitle}>Transacciones Recientes</Text>
              {expenses.map((item,idx) => (
                <View key={item.id} style={s.expItem}>
                  <Text style={s.expDesc}>#{expenses.length-idx} - {item.desc}</Text>
                  <Text style={s.expAmt}>${item.amount.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:     { flex:1, backgroundColor:"#FDFBF7" },
  container:{ padding:18, alignItems:"center" },
  title:    { fontSize:32, fontWeight:"900", color:"#2E7D5B", letterSpacing:0.5 },
  sub:      { fontSize:13, color:"#7898A8", fontWeight:"600", marginBottom:12 },
  progCard: { width:"100%", backgroundColor:"#EAF6F0", padding:12, borderRadius:16, marginBottom:12 },
  progTxt:  { fontSize:13, fontWeight:"700", color:"#256E4A", marginBottom:6, textAlign:"center" },
  progBg:   { width:"100%", height:10, backgroundColor:"#C8E8D8", borderRadius:6, overflow:"hidden" },
  progFill: { height:"100%", backgroundColor:"#348C60", borderRadius:6 },
  stage:    { width:"100%", alignItems:"center", backgroundColor:"#FFFFFF", borderRadius:24, paddingVertical:12, paddingHorizontal:16, marginBottom:14, borderWidth:2, borderColor:"#E5EFEA", elevation:2 },
  canvas:   { width:STAGE_SIZE, height:STAGE_SIZE, position:"relative" },
  layer:    { position:"absolute", top:0, left:0, width:STAGE_SIZE, height:STAGE_SIZE },
  status:   { fontSize:13, fontWeight:"600", color:"#4A2518", backgroundColor:"#FFF5E4", paddingVertical:8, paddingHorizontal:14, borderRadius:12, textAlign:"center", marginTop:6 },
  bowls:    { flexDirection:"row", justifyContent:"space-around", marginTop:6 },
  bowl:     { alignItems:"center", backgroundColor:"#F9F7F3", padding:8, borderRadius:12, width:65 },
  bowlE:    { fontSize:22, marginBottom:2 },
  bowlT:    { fontSize:11, fontWeight:"700", color:"#4A2518" },
  card:     { width:"100%", backgroundColor:"#FFFFFF", borderRadius:18, padding:14, marginBottom:14, borderWidth:1, borderColor:"#ECEAE4" },
  cardTitle:{ fontSize:14, fontWeight:"800", color:"#4A2518", marginBottom:10 },
  btnGrid:  { flexDirection:"row", flexWrap:"wrap", gap:8, justifyContent:"center" },
  btn:      { backgroundColor:"#F3EFEA", paddingVertical:8, paddingHorizontal:12, borderRadius:12, borderWidth:1.5, borderColor:"#E0D6C8" },
  btnA:     { backgroundColor:"#348C60", borderColor:"#256E4A" },
  btnTxt:   { fontSize:12, fontWeight:"700", color:"#4A2518" },
  btnTxtA:  { color:"#FFFFFF" },
  resetBtn: { backgroundColor:"#FFF0EE", paddingVertical:8, paddingHorizontal:14, borderRadius:12, borderWidth:1.5, borderColor:"#F48B82", marginTop:4 },
  resetTxt: { fontSize:12, fontWeight:"700", color:"#B5382E" },
  row:      { flexDirection:"row", gap:8, marginBottom:10 },
  input:    { backgroundColor:"#F9F7F3", borderWidth:1.5, borderColor:"#E2DCD3", borderRadius:12, paddingHorizontal:12, paddingVertical:10, fontSize:13, color:"#333" },
  regBtn:   { backgroundColor:"#F69B42", paddingVertical:13, borderRadius:14, alignItems:"center" },
  regTxt:   { color:"#FFFFFF", fontSize:15, fontWeight:"800" },
  expItem:  { flexDirection:"row", justifyContent:"space-between", paddingVertical:8, borderBottomWidth:1, borderBottomColor:"#F2EFE9" },
  expDesc:  { fontSize:13, fontWeight:"600", color:"#4A2518" },
  expAmt:   { fontSize:13, fontWeight:"800", color:"#2E7D5B" },
});
