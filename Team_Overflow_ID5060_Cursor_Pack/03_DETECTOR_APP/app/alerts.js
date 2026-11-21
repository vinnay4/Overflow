/** Spoken alarm copy. Hindi uses the hi-IN voice when the phone has one. */
export function alertCopy(urgent, hindi) {
  if (hindi) {
    return urgent
      ? "दूध उबल रहा है। आँच अभी कम करें।"
      : "दूध उबलने वाला है। आँच सिम पर करें।";
  }
  return urgent
    ? "Milk is boiling. Turn the flame down now."
    : "Milk is about to boil. Turn the flame to sim.";
}

export function alertLang(hindi) {
  return hindi ? "hi-IN" : "en-IN";
}
