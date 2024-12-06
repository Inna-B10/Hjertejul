import families from "../data/families.json" with { type: "json" }
import cardFamily from "./cardFamily.js"

const output = document.getElementById('output')
// const json_url = './data/families.json'

console.log(families)

function showFamilies(array){
  if(array){
    output.innerText = ''
  }

  array.forEach(family => {
    const card=cardFamily(family)
    console.log(card)
    // output.append(card)
    
  });
}
showFamilies(families)
