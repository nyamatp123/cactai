# Cactai Cactus Knowledge Base

Last compiled: 2026-10-03
Purpose: an offline reference that the Cactai assistant (Gemini) reads instead of searching the web. It covers the 10 plant types offered in the Add Plant dropdown.

---

## 0. How the assistant should use this file

1. Match the user's plant `type` (case-insensitive) to one entry in section 3. The headings use the same names as the dropdown. If the type is "Not sure" or does not match anything, use entry 3.10 and the general rules in section 5.
2. Use only the sensor numbers provided in the request. Never invent readings.
3. Answer in 2 to 4 short sentences, plain language, no markdown, unless the user asks for detail.
4. Compare the reading to the plant's own entry, not to a generic cactus. Two entries (Christmas cactus and Moon cactus) behave very differently from a desert cactus.
5. A sensor reading alone is not proof. When a reading is borderline, suggest checking the soil with a finger or a wooden skewer and looking at the plant (firm and plump is good).
6. If a question is outside this file (pests in detail, medical or toxicity questions beyond what is written, plant ID from a photo), say so honestly and give the safe general advice.
7. Where sources disagreed, the entry says so. Present the common ground rather than picking a side silently.

---

## 1. Reading the Cactai sensor

- **Soil moisture** is reported as a percentage. These sensors are usually capacitive or resistive probes, so the number is **relative**, not a true water-content measurement. It changes with soil type, pot size, how deep the probe sits, and the individual sensor.
- **Light** is reported as a plain number with no confirmed unit. Do **not** treat it as lux. The dashboard labels it using these Cactai thresholds:
  - **Bright**: above 2500
  - **Medium**: above 1000, up to 2500
  - **Low**: 1000 or below
- Typical behaviour: right after a thorough watering the moisture reading jumps, then slowly falls over days or weeks as the pot dries. A healthy desert cactus spends most of its time at a low reading.

### Calibrating (recommended)

1. Put the probe in completely dry potting mix and note the reading. That is "dry".
2. Water thoroughly, let it drain, and note the reading. That is "wet".
3. Adjust the suggested thresholds below so they sit between those two numbers.

### Suggested Cactai thresholds (starting points, not from published sources)

These are heuristic defaults chosen by Cactai to match the care guidance below. Published guides describe watering in words (let the soil dry out fully, keep slightly moist, and so on), not in sensor percentages, so treat these numbers as defaults to be tuned after calibration.

| Plant | Consider watering when moisture stays below | Possible overwatering concern if above, for 7+ days | Preferred light label |
|---|---|---|---|
| Barrel cactus | 8% | 35% | Bright |
| Golden barrel | 8% | 35% | Bright |
| Prickly pear | 10% | 40% | Bright |
| Bunny ears cactus | 10% | 40% | Bright |
| Moon cactus | 8% | 30% | Medium to Bright (not harsh direct sun) |
| Old man cactus | 8% | 35% | Bright |
| Christmas cactus | 30% | 65% | Medium to Bright (indirect) |
| Saguaro | 10% | 35% | Bright |
| Pincushion cactus | 10% | 35% | Bright (shield from harsh summer sun) |
| Not sure | 10% | 35% | Bright |

Important: a low reading on its own is **not** an emergency for a desert cactus. Also, never recommend watering a dormant desert cactus in winter just because the number is low.

---

## 2. Quick comparison

Cactai "thrives at home" rating (1 = difficult, 5 = very easy) is a summary judgement by Cactai based on the sources listed at the end.

| Plant | Scientific name | Type | Light | Watering style | Growth | Thrives at home |
|---|---|---|---|---|---|---|
| Barrel cactus | Ferocactus and Echinocactus species | Desert | Full sun, 6 to 8 h bright light | Soak, then dry fully | Slow | 3/5 |
| Golden barrel | Echinocactus grusonii | Desert | Full sun, very bright | Soak, then dry fully | Slow | 4/5 |
| Prickly pear | Opuntia (e.g. O. ficus-indica) | Desert | Full sun, 4 to 6 h direct | Let dry between waterings | Moderate | 4/5 |
| Bunny ears cactus | Opuntia microdasys | Desert | Bright, mostly direct | Soak, then dry fully | Slow to moderate | 4/5 |
| Moon cactus | Gymnocalycium mihanovichii (grafted) | Grafted desert | Bright but not harsh | Sparingly | Slow | 2/5 |
| Old man cactus | Cephalocereus senilis | Desert | Bright, direct | Light and infrequent | Very slow | 3/5 |
| Christmas cactus | Schlumbergera | Rainforest | Bright indirect | Slightly moist | Moderate | 4/5 |
| Saguaro | Carnegiea gigantea | Desert | Very bright | Moderate in growth, sparse in winter | Extremely slow | 2/5 |
| Pincushion cactus | Mammillaria species | Desert | Bright, avoid harsh summer sun | Soak, then dry fully | Slow | 5/5 |
| Not sure | n/a | n/a | Bright | Dry out between waterings | n/a | n/a |

---

## 3. Plant entries

### 3.1 Barrel cactus

- **Slug:** `barrel-cactus`
- **Scientific names:** Barrel cacti are various round to cylindrical species in the *Ferocactus* and *Echinocactus* genera. Examples: fishhook barrel (*Ferocactus wislizeni*), compass or California barrel (*F. cylindraceus*), devil's tongue (*F. latispinus*).
- **Origin:** Deserts of North America, including the Sonoran and Mojave.
- **Appearance:** Ribbed, heavily spined, usually a single body that starts round and may become columnar with age.

**Light**
- Wants full sun. Roughly 6 to 8 hours of bright light a day is the usual guidance, from a south or west window.
- This group is described as one of the least forgiving cactus groups in weak light. Stretching or leggy growth means light is too low.
- Rotate the pot now and then so it grows evenly.
- Dashboard target: **Bright**.

**Water**
- Water thoroughly, then let the mix dry fully before watering again.
- Cut watering sharply in winter, especially when it is cool.
- Wait several days after repotting before the first watering.
- Rapid, soft swelling usually means too little light, too much water, or both.

**Soil and pot**
- Very fast-draining mineral mix. Dense soil is the main long-term risk. Pot must have drainage holes.

**Temperature and humidity**
- Comfortable between about 15 and 32 °C (60 to 90 °F). Warmth helps growth, but many stay healthiest with a cooler, very dry rest in winter. Dry air is fine.

**Growth and flowering**
- Slow, especially when young. Flowering is much more likely outdoors in hot climates than indoors.

**Warning signs**
- *Too much water:* soft, mushy or dark base; soil stays wet for days.
- *Too little light:* thin, stretched, pale growth.
- *Too much sun suddenly:* brown or bleached patches after a move to a brighter spot. Introduce strong sun gradually.

**Safety:** Not poisonous according to the sources, but the spines can injure pets and people. Use thick gloves or folded paper when moving it.

**Fit for a home setup:** Good if you have a very bright south or west window or a grow light. Weak light is the usual cause of failure.

---

### 3.2 Golden barrel

- **Slug:** `golden-barrel`
- **Scientific name:** *Echinocactus grusonii* (sometimes listed under the name *Kroenleinia grusonii*)
- **Other names:** golden ball cactus, mother-in-law's cushion
- **Origin:** East-central Mexico. It is endangered in the wild, though common in nurseries.
- **Appearance:** A round, ribbed, deep green body with dense golden spines. Up to about 35 ribs at maturity.

**Light**
- Full sun and very bright indoor light. Place in the sunniest window and add a grow light if needed.
- Dashboard target: **Bright**.

**Water**
- Water deeply, then wait for the soil to dry completely. Indoors that often means every few weeks to about monthly, depending on pot size, light and warmth.
- Reduce further in autumn and winter.

**Soil and pot**
- Gritty mix with a high share of mineral material (one grower guide suggests 70 to 80 percent coarse sand, pumice or perlite). Drainage hole is essential.
- Once mature, repot only every 2 to 3 years or when needed.

**Temperature and humidity**
- Best around 10 to 24 °C (50 to 75 °F). Keep above about 5 °C (40 °F) and away from frost. It cannot take hard freezes, so it must come indoors in cold climates.
- Humidity is not a concern. Normal indoor air is fine.

**Growth and flowering**
- Grows quickly when young, then slows right down. Can reach about 3 feet (90 cm) wide over many years, and may live around 30 years in good conditions.
- Yellow flowers appear only on mature plants in strong sun, and rarely indoors.

**Warning signs**
- *Too much water:* soft or yellowing sections, base rot.
- *Too little light:* stretching, loss of the tidy round shape.

**Safety:** Sharp spines. Wear gloves when handling or repotting.

**Fit for a home setup:** One of the better beginner cacti if it gets enough light.

---

### 3.3 Prickly pear

- **Slug:** `prickly-pear`
- **Scientific name:** *Opuntia* species (the edible prickly pear is *Opuntia ficus-indica*). There are more than 200 *Opuntia* species.
- **Appearance:** Flat, paddle-shaped pads covered in spines and tiny hair-like barbs (glochids) that detach easily.

**Light**
- Full sun. Indoors it needs a very bright spot, ideally a south or west window, with roughly 4 to 6 hours of direct sun in summer.
- Dashboard target: **Bright**.

**Water**
- Let the soil dry out before watering again and let all excess drain away. Never leave the pot sitting in water.
- Winter: sources differ. One suggests watering about once every 6 weeks indoors; another, aimed at plants that rest outdoors or in a cool room, keeps them completely dry from roughly October to March. If the plant is warm and growing indoors, give very little; if it is resting in the cool, give none.
- Most guides agree that overwatering is the main cause of rot.

**Soil and pot**
- Well-draining cactus mix. Pot only slightly bigger than the root ball. Repot only when rootbound or top-heavy, roughly every 2 to 3 years.

**Temperature and humidity**
- Normal indoor temperatures (about 18 to 24 °C) are fine. Dry air is fine. Keep away from heaters and air conditioners.
- A cooler winter rest (about 10 to 13 °C) can encourage flowering.

**Growth and flowering**
- Moderate growth with enough light. Can flower yellow in strong light and may fruit, though less often indoors.

**Warning signs**
- *Too much water:* soft, discoloured pads, rot at the base.
- *Too little light:* thin, pale or lopsided new pads.
- Indoor plants attract mealybugs and scale insects more often than outdoor ones.

**Safety:** The tiny glochids stick in skin and are hard to remove. Use thick gloves (nitrile gloves under gardening gloves help) and keep it out of reach of pets and children.

**Fit for a home setup:** Easy and forgiving if it gets strong light, and tolerates being ignored.

---

### 3.4 Bunny ears cactus

- **Slug:** `bunny-ears-cactus`
- **Scientific name:** *Opuntia microdasys*
- **Other names:** angel's wings, polka dot cactus
- **Origin:** Central and northern Mexico.
- **Appearance:** Paired oval pads with clusters of tiny golden or white barbs (glochids), not long spines.

**Light**
- Most guides want bright, direct light, with a south-facing spot ideal. A grow light on a 12 to 16 hour timer is suggested if natural light is weak. One retailer lists bright indirect light instead, so the safest summary is "as bright as you can offer, with some direct sun".
- Low light causes stretching (etiolation).
- Dashboard target: **Bright**.

**Water**
- Soak thoroughly until water runs out, then let the soil dry completely. In the growing season (spring and summer) that is typically every 1 to 2 weeks, depending on light, warmth and pot size.
- Winter: much less. Common advice ranges from about once a month to none at all while it is dormant. Do not force a rest indoors if it is warm and well lit, but do cut back.

**Soil and pot**
- Very fast-draining, mineral-rich mix. Repot every year or two. Empty saucers right after watering.

**Temperature and humidity**
- Likes warmth. Not frost hardy. Bring indoors before temperatures drop below about 5 °C. Growth slows below about 15 °C.

**Growth and flowering**
- Stays compact, roughly 30 to 60 cm tall indoors, and adds about 1 to 3 new pads a year with good light. Yellow flowers appear in strong light on mature plants but are rare indoors.

**Warning signs**
- *Yellow pads:* most often overwatering or too little light.
- *Soft, dark patches:* rot. Cut away rotten parts, repot into dry mix, and water less often.

**Safety:** The fuzzy-looking glochids detach easily and irritate skin. Keep away from walkways and handle with gloves.

**Fit for a home setup:** A good first cactus. Propagates easily from a single fallen pad.

---

### 3.5 Moon cactus

- **Slug:** `moon-cactus`
- **Scientific name:** *Gymnocalycium mihanovichii*, grafted onto a green rootstock (often *Hylocereus*, also listed as *Selenicereus undatus*)
- **Other names:** Hibotan cactus, ruby ball cactus
- **How it is built:** Two cacti joined together. The bright pink, red, orange or yellow ball on top lacks chlorophyll, so it cannot survive alone. The green cactus underneath feeds it.

**Light**
- Sources disagree. Some say bright, direct sun from a south or west window; others, and the better-supported view for the coloured top, say bright **indirect** light, because strong sun can bleach or scorch it.
- A pale or washed-out top usually means too little light. A bleached or scorched look means too much.
- Dashboard target: **Medium to Bright**, with a sheer curtain on harsh days.

**Water**
- Water sparingly and let the soil dry out completely between waterings, about every 2 to 4 weeks in the growing season depending on conditions.
- Winter: little to none. Some guides stop watering from about October to February and mist lightly at most.
- Wait about a week after repotting before watering.

**Soil and pot**
- Light, fast-draining cactus mix with drainage holes. Low feeding needs.

**Temperature and humidity**
- Keep warm. Cold can kill the coloured top even though the green base is hardier. Prefers low humidity.

**Lifespan**
- Often short-lived even with good care. The graft can separate over time because the green base grows faster than the top. The life of a moon cactus can be extended by re-grafting. If the top dies, the green base often survives as a plain cactus.

**Warning signs**
- *Brown or mushy top:* overwatering or cold. *Faded colour:* too little light. *Top tilting or coming apart:* graft separating.

**Fit for a home setup:** Decorative but delicate. Best for people who will keep watering light and avoid cold windowsills in winter.

---

### 3.6 Old man cactus

- **Slug:** `old-man-cactus`
- **Scientific name:** *Cephalocereus senilis*
- **Other names:** old man of the Andes, white Persian cat cactus, bunny cactus
- **Origin:** Central Mexico (e.g. Hidalgo and Guanajuato), rocky dry areas.
- **Appearance:** Tall, columnar cactus covered in long white hair that hides the spines. The hair helps shield it from strong sun and heat, and is most striking on young plants.

**Light**
- Bright, direct light. Tolerates full sun for much of the day. Indoors, give it a south-facing window or a grow light. Strong light also encourages the hairy coat.
- Dashboard target: **Bright**.

**Water**
- Drought tolerant. Soil should dry between waterings. One grower guide suggests roughly once every 2 to 3 weeks in summer and about once a month in winter. Another says to withhold water and fertiliser in winter.
- Use an unglazed (terracotta) pot so excess moisture can evaporate.

**Soil and pot**
- Well-draining cactus mix, or a mix of sand, perlite and topsoil. Drainage holes required. Repot rarely, or into a slightly larger pot each spring when young.

**Temperature and humidity**
- Likes warmth, at least about 18 °C (65 °F) indoors. For best growth give a cooler winter rest (below about 18 °C). Little humidity needed.

**Growth and flowering**
- Very slow. Can eventually become very tall outdoors (many metres over 20 to 50 years), but stays manageable in a pot. Flowers are nocturnal and may not appear for 10 to 20 years. Feed once a year in spring, if at all.

**Warning signs**
- *Too much water:* soft base, dark or sunken spots.
- *Too little light:* sparse hair, thin stretched growth.

**Safety:** Hair covers sharp spines, so handle with care.

**Fit for a home setup:** Fine in a sunny window, but patience is needed since it grows slowly.

---

### 3.7 Christmas cactus

- **Slug:** `christmas-cactus`
- **Scientific name:** *Schlumbergera* species
- **Other names:** Thanksgiving cactus, holiday cactus, crab cactus
- **Origin:** Humid rainforests of Brazil. **It is not a desert cactus**, so it does not follow the "let it dry out completely" rule.
- **Appearance:** Flat, jointed, leaf-like segments that arch and trail, with bright flowers in late autumn and winter (roughly November to January).

**Light**
- Bright indirect light, such as an east or west window. It tolerates some direct sun. Too much strong light outside flowering time can turn it yellow, and too little light means fewer buds.
- Dashboard target: **Medium to Bright**, indirect.

**Water**
- Keep the soil a little more moist than a desert cactus: let roughly the top third to half of the mix dry between waterings, then water well.
- Spring to early autumn is the growing season, when the soil should stay lightly moist.
- To set buds, many growers give a cooler, drier rest in October and November (soil kept fairly dry until buds form), then return to normal watering. A short rest in February or March is also commonly described.
- Never leave the roots sitting in water.

**Soil and pot**
- Loose, airy mix, partly cactus or succulent mix. Slightly pot-bound plants bloom best. Repot only every 2 to 3 years.

**Temperature and humidity**
- Comfortable around 15 to 21 °C (60 to 70 °F). Prefers moderate to higher humidity (about 40 to 50 percent is often quoted) but tolerates ordinary indoor air. In dry rooms, group plants or use a humidifier.
- Keep away from cold drafts and sudden temperature changes.

**Warning signs**
- *Soft limp segments or black stems:* overwatering.
- *Shrivelled segments with dry mix:* thirsty.
- *Dropped buds or flowers:* dry soil, low light, cold drafts, temperature swings, or repotting while in bloom.

**Safety:** Commonly listed as safe for pets by plant retailers, but check a pet-safety source if this matters.

**Fit for a home setup:** Very good, and long-lived if you give it a bit more water and humidity than a desert cactus. Be careful: many "cactus" rules (bone dry soil, full desert sun) can harm it.

---

### 3.8 Saguaro

- **Slug:** `saguaro`
- **Scientific name:** *Carnegiea gigantea* (the only species in its genus)
- **Origin:** Sonoran Desert (Arizona, Sonora in Mexico, and the south-east corner of California).
- **Appearance:** Smooth, waxy, ribbed column that can grow arms with age.

**Growth**
- Extremely slow. Often only a couple of centimetres in the first ten years, and roughly 1 metre in 30 years. Can live 150 to 200 years. In pots, growth slows or stops once the roots fill the container.
- Flowers only after several decades.

**Light**
- Needs a very bright position, ideally a south or west window, or a sunny conservatory. Strong light matters more than for most houseplants.
- Dashboard target: **Bright**.

**Water**
- Active growing season (about March or April to September): water moderately. A potted plant may need water about every week in hot weather according to one desert museum guide, while other houseplant guides suggest less. A very small seedling may need only about a tablespoon of water every 4 to 6 weeks. Always water by plant size and pot size, and check the soil first.
- Autumn and winter: sparingly, about once or twice a month at most when cool.

**Soil and pot**
- Fast-draining cactus soil. Drainage holes are essential. The root system is weak, so do not use an oversized pot.

**Temperature**
- Avoid temperatures below about 15 °C (60 °F) when kept as a houseplant. Move it outdoors in warm weather only after getting it used to the sun gradually.

**Warning signs**
- *Rot:* soft, discoloured base. *Etiolation:* thin, pale growth from low light.

**Notes:** Wild saguaros are protected, so buy only nursery-grown plants. Growing one indoors long-term can be difficult.

**Fit for a home setup:** Possible for a young plant with excellent light, but it is slow and demanding. Set expectations of very little visible growth.

---

### 3.9 Pincushion cactus

- **Slug:** `pincushion-cactus`
- **Scientific name:** *Mammillaria* species (about 200 to 300 species). Includes the powder puff cactus (*M. bocasana*) and the old lady cactus (*M. hahniana*).
- **Appearance:** Small, rounded or short clumping cacti covered in bumps (tubercles) with hair or spines, often with a ring of small flowers.

**Light**
- Likes intense light, but many species dislike long exposure to hot direct summer sun. Put it in the brightest window you have. For *M. bocasana*, an east window or setting it a foot back from the glass in peak summer heat helps prevent scorching.
- Strong light can bronze the plant, which encourages flowering and thicker spines or wool.
- Dashboard target: **Bright**.

**Water**
- Spring to autumn: water deeply, then wait for the soil to dry out before watering again.
- Winter: stop watering or give almost none, since this is the normal dormant season. Resume gradually in spring.
- Never water while the soil is still wet.

**Soil and pot**
- Well-aerated, free-draining mix with drainage holes. Repot roughly every 3 years in spring.

**Temperature and humidity**
- Not frost hardy; bring indoors if it drops near freezing. Dry air is fine. Good airflow helps.

**Growth and flowering**
- Slow, often forms clumps. *Mammillaria* are among the easiest cacti to bring into flower indoors, especially with a bright, cool, dry winter rest.

**Warning signs**
- *Collapsing or mushy body:* rot, which is usually too late to treat once it has collapsed, so catch overwatering early.
- *Brown or yellow on the sun-facing side:* too much heat or sun, especially behind glass.

**Fit for a home setup:** One of the easiest cacti for a windowsill. A great choice for beginners.

---

### 3.10 Not sure

- **Slug:** `not-sure`
- Use this entry when the user does not know the cactus type. Give safe, general desert-cactus advice and gently help them identify it.

**Helpful questions to ask (one at a time):** Is it round and ribbed, tall and column-like, made of flat pads, or small and bumpy? Does it have long spines, short hairs, or white fuzz? Is the top brightly coloured? Are the stems flat and jointed like leaves (this suggests a Christmas cactus, which is cared for differently)?

**Safe defaults for an unknown desert-type cactus**
- Give the brightest light available. At least about 4 hours of bright direct light a day is a common minimum.
- Water deeply, then let the soil dry out fully. Some cacti can go 10 to 14 days between waterings, others a couple of months, so check the soil rather than following a schedule.
- Water much less in winter.
- Use a pot with drainage holes and a mix that drains in under a minute.
- Dashboard target: **Bright**.

**If it has flat, jointed, leaf-like segments:** treat it like a Christmas cactus (see 3.7), not a desert cactus.
**If it has a brightly coloured ball on a green stem:** it is probably a grafted moon cactus (see 3.5).

---

## 4. Seasons at a glance (Northern Hemisphere)

| Period | Desert cacti | Christmas cactus |
|---|---|---|
| Spring to early autumn | Active growth. Water thoroughly when dry. Feed lightly if desired. | Active growth. Keep lightly moist. |
| Late autumn to winter | Mostly dormant. Water sparingly or not at all. Keep cool, bright and dry. | Flower buds set (cooler, drier rest in Oct and Nov), then flowering, then a short rest. Avoid cold drafts. |

---

## 5. General rules and troubleshooting

**The golden rules**
1. Overwatering is the most common way to kill a cactus. When unsure, wait.
2. Drainage matters most: a pot with a drainage hole, a gritty fast-draining mix, and no standing water in the saucer.
3. Use the plant's condition as well as the sensor. A healthy cactus feels firm. Softness, mushiness or translucent patches suggest too much water.
4. Do not water on a fixed schedule. Check the soil and the season first.
5. After repotting, wait several days (about a week for some) before watering.
6. Water the soil rather than the plant body, and use room-temperature water.

**Light**
- A cactus that is thin, stretched, or leaning toward the window is not getting enough light (etiolation). Move it closer to the light or add a grow light.
- A washed-out, yellowing or bleached cactus may be getting too much intense light. Move it to a slightly gentler spot, such as a west window.
- Introduce a stronger light gradually, because sudden changes can scorch it.
- Rotate the pot occasionally so growth is even.

**Problem table**

| Symptom | Likely cause | What to do |
|---|---|---|
| Soft, mushy, dark base | Overwatering or poor drainage | Stop watering. Check roots. Cut away rot, let it dry, repot in dry gritty mix. |
| Yellow or translucent patches | Too much water, or too much sun | Check the soil first, then the light. |
| Wrinkled, shrunken body with dry soil | Under-watering | Give a deep watering. Dormant desert cacti may wrinkle slightly in winter, which is normal. |
| Thin, tall, pale new growth | Not enough light | Brighter window or a grow light. |
| Brown, dry, scorched patches | Too much direct sun, or a sudden light change | Move back from the glass and ease it into stronger sun. |
| White cottony spots | Mealybugs | Dab with a cotton swab dipped in rubbing alcohol. |
| No growth for weeks | Normal for slow species or in winter | Check light and season before changing anything. |
| Sensor reads very low for days | Dry soil, or the probe has lost contact | Check the probe is firmly in the soil and clean, then check the plant. |
| Sensor reads high for days | Slow-drying pot, or the probe sits in a wet pocket | Check drainage. Skip watering. Look at the base of the plant. |

**Other notes**
- Terracotta pots dry faster than plastic and help keep soil from staying soggy.
- Fertiliser is optional. If used, a cactus-specific, low-nitrogen formula during the growing season only is the usual advice.
- Dust on a cactus reduces the light it receives, so clean it gently when needed.
- Keep cacti away from cold drafts, heaters and sudden temperature changes.

---

## 6. Sources

The facts above were paraphrased from these types of reference pages (retrieved 2026-10-03). Where sources disagreed, the entries say so.

- Golden barrel: Mountain Crest Gardens, Houseplants Expert, Succulents and Sunshine, Foliage Factory, MasterClass indoor cactus guide, Clemson HGIC indoor cacti
- Barrel cactus: Houseplant Central, GardenTags, Foliage Factory (*Ferocactus*), Cultivea, Clemson HGIC
- Prickly pear: Horticulture Magazine, Love the Garden, Almanac, Flora Toskana, Highland Moss
- Bunny ears: Plant Addicts, Houseplant Central, Foliage Factory, Healthy Houseplants, MasterClass, Monster Gardens
- Moon cactus: Almanac, Houseplant Central, Leafy Place, GardenTags, Foliage Factory, Mountain Crest Gardens
- Old man cactus: Planet Desert, NC State Extension Plant Toolbox, World of Succulents, Hunker, AUB Landscape Plant Database, Harvest to Table
- Christmas cactus: Sprout Home care sheet, SOLTECH, Be.green, Horticulture Magazine, University of Minnesota Extension
- Saguaro: Love the Garden, Arizona-Sonora Desert Museum care sheet, Harvest to Table, Hunker, Healthy Houseplants
- Pincushion (*Mammillaria*): World of Succulents, Gardener's Path, Nature and Garden, University of Minnesota Extension, Missouri Botanical Garden
- General: New York Botanical Garden indoor cacti guide, Missouri Botanical Garden cacti and succulents fact sheet, Clemson HGIC

The suggested sensor thresholds in section 1, the "thrives at home" ratings in section 2, and the winter and seasonal summaries are Cactai's own summaries and defaults, not direct quotes from these sources.
