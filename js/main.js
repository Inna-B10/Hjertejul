import families from "../data/families.json" with { type: "json" }
import cardFamily from "./cardFamily.js"

export const output = document.getElementById('output')

function showFamilies(array){
  if(array){
    output.innerText = ''
  }

  array.forEach(family => {
    cardFamily(family)   
  });
}
showFamilies(families)
