import fs from "node:fs";
const m=JSON.parse(fs.readFileSync(new URL("../agents/TEAM_MANIFEST.json",import.meta.url),"utf8"));
if(m.status!=="design_only"||m.human_owner!=="Sérgio Monteiro")throw Error("Invalid agent authority");
if(m.profiles.length!==4)throw Error("Expected four digital profiles");
for(const p of m.profiles){
 const name=p.id.replace(/^club-/,"");
 if(!fs.existsSync(new URL("../agents/"+name+"/SOUL.md",import.meta.url)))throw Error("Missing SOUL: "+name);
 if(!p.state.includes("not_provisioned"))throw Error("Agent state misrepresented");
}
console.log("Agent identities and statuses valid (design only)");
