# History: what the eras rest on, and how far it is checked

The rule (`CLAUDE.md`): the history is from memory until checked, and a date
or a die-off is checked before it shapes a number. This file holds each
claim the game leans on, its source, and how far it was checked.

"Searched" means read in search summaries and abstracts, not in the papers
themselves. That is enough to set an era's span and a die-off's shape; it is
not enough to quote. Every number in `src/data/world.data.js` stays tuned,
not sourced: the history sets which way a die-off pushes, not how far.

## The eras built before 2026-11-28 (from memory, not yet checked)

The Shore (Late Devonian), the Coal Forests (Carboniferous, the rainforest
collapse), the Drying (Early Permian), the Long Shadow (Late Permian, the
Great Dying, about 252 Ma), the Triassic (ending about 201 Ma, with the wet
episode near 233 Ma). The ladder's "the great amphibians only just came
through" is also from memory.

## The eras of phase 3 (`docs/FRAME-next.md` section 4), searched 2026-11-28

| Claim | What the sources say | Checked |
|---|---|---|
| The Jurassic runs from about 201 to 145 Ma | Early Cretaceous "approximately 145 to 100 million years ago" (in the angiosperm summaries below) | Searched |
| The Toarcian event, about 183 Ma: warming, seas starved of oxygen, losses mostly in the sea | About 183 Ma; two pulses, the first near 184 Ma; warming tied to Karoo-Ferrar volcanism, CO2 roughly doubled; anoxic bottom waters for at least a million years; corals lost 49% of genera. One study found temperature a poor predictor of community change. Sources: [Wikipedia, Toarcian turnover](https://en.wikipedia.org/wiki/Toarcian_turnover); [Them et al., thallium isotopes (PMC6042096)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6042096); [Danise et al. 2021, EPSL](https://flore.unifi.it/retrieve/e398c381-d0cf-179a-e053-3705fe0a4cff/Danise%20et%20al%202021%20EPSL%20-%20online.pdf); [coral losses (NSF PAR)](https://par.nsf.gov/servlets/purl/10351194) | Searched |
| The end of the Jurassic, about 145 Ma, is a small die-off that falls hardest on big land animals | Now "more commonly regarded as a minor extinction"; larger, more specialised animals such as saurischian dinosaurs suffered most; a global fall in sea level. Sources: [Tennant, Mannion and Upchurch 2016, Nature Communications](https://www.nature.com/articles/ncomms12737/); [Tennant et al., Biological Reviews (PMC6849608)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6849608/) | Searched |
| Flowering plants spread in the Early Cretaceous | First pollen in the Valanginian-Hauterivian; the main spread "between about 130 and 90 million years ago"; earliest sure macrofossil about 125 Ma. Their origin is disputed (molecular clocks put it earlier); whether they changed the world's vegetation at once is debated. Sources: [Wikipedia, fossil history of flowering plants](https://en.wikipedia.com/wiki/Fossil_history_of_flowering_plants); [Herendeen et al. 2017, Nature Plants](https://geo.au.dk/fileadmin/www.geo.au.dk/nyheder/2017/2017_Herendeen_et_al_Nature_Plants.pdf); [PMC3529080](https://pmc.ncbi.nlm.nih.gov/articles/PMC3529080) | Searched |
| The Cenomanian-Turonian event, about 94 Ma: the last global oceanic anoxic event | 93.9 ± 0.15 Ma; lasted about 0.7 to 0.9 million years; 45 to 75% of species lost in non-tropical late Cenomanian faunas; extreme warming probably the main cause. It falls **inside the Late Cretaceous**, not at the end of the Early. Sources: [Wikipedia, Cenomanian-Turonian boundary event](https://en.wikipedia.org/wiki/Cenomanian-Turonian_boundary_event); [Scientific Reports 2021](https://link.springer.com/10.1038/s41598-021-92817-5) | Searched |
| The end of the Cretaceous, 66.0 Ma: the impact at Chicxulub, and the Deccan's burning | Impact at 66.0 Ma; most tetrapods over about 25 kg died, except some cold-blooded ones such as sea turtles and crocodilians (an encyclopedia summary; no primary paper found for the 25 kg line). Sources: [Wikiwand, K-Pg](https://www.wikiwand.com/en/articles/K-T); [PMC6058194](https://pmc.ncbi.nlm.nih.gov/articles/PMC6058194) | Searched; the 25 kg line is secondary |
| The survivors were small | The largest early mammal survivors weighed about 500 g; mammals of 25 to 30 kg appear about 300,000 years after. Sources: [Science News for Students](https://www.snexplores.org/article/fossils-show-mammals-rise-dominance-after-dino-killing-asteroid); [NOVA](https://www.pbs.org/wgbh/nova/article/fossils-million-years-after-dinosaurs-died) | Searched |
| Life came back fast where it could dig | Burrowers in the crater within years; burrows on land within ten thousand years. Sources: [GSA 2020](https://www.geosociety.org/GSA/News/pr/2020/20-22.aspx); [Discover](https://www.discovermagazine.com/planet-earth/life-recovered-mere-years-after-asteroid-impact) | Searched |

## What it changes in the design

- The Cenomanian-Turonian event is a turn in the middle of the last era,
  not the end of the one before. The era of flowers ends at about 94 Ma on
  that event; the last era runs from it to the impact.
- The end of the Jurassic is a small die-off aimed at big bodies: the right
  place for a warning that size is a risk, long before the impact.
- The impact's survivors were small, could dig or lived by water, and some
  were cold-blooded. The game keeps "any body can come through", so a big
  lineage that heeds the warning needs a road to shrink in time.
