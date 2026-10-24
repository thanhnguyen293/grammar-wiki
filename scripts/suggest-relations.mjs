// Suggests docs/data/relations.json: word families, synonyms and antonyms among the core
// words (specialist topics are left out: they reuse core words with other meanings).
// - family: a word whose base form (after stripping a common suffix or prefix) is also a core
//   word, e.g. happiness → happy, unlock → lock, plus the irregular families in EXTRA_FAMILY.
//   Links reviewed as wrong (the words only look alike) go in NOT_FAMILY.
// - synonym / antonym: the hand-made lists below, kept to the words that exist in the data.
// Usage: node scripts/suggest-relations.mjs           print the suggested groups
//        node scripts/suggest-relations.mjs --pairs   print each suffix/prefix link, to review NOT_FAMILY
//        node scripts/suggest-relations.mjs --write   write docs/data/relations.json
import { readFileSync, writeFileSync } from 'node:fs'

const root = new URL('../docs/', import.meta.url)
const topicsSrc = readFileSync(new URL('.vitepress/vocabTopics.ts', root), 'utf8')
const coreSlugs = [...topicsSrc.matchAll(/slug: '([^']+)'.*?target: \d+(, track)?/g)].filter((m) => !m[2]).map((m) => m[1])

/** Every core word with its frequency order across topics, so groups list the most common first. */
const order = new Map()
for (const slug of coreSlugs)
  for (const x of JSON.parse(readFileSync(new URL(`data/vocab/${slug}.json`, root), 'utf8'))) order.set(x.w, order.size)
const has = (w) => order.has(w)
const byOrder = (a, b) => order.get(a) - order.get(b)
/** One group per line, words separated by commas. */
const groups = (s) =>
  s
    .trim()
    .split('\n')
    .map((l) => l.split(',').map((w) => w.trim()))

// suffix → replacements tried on the stem, e.g. "iness" + "y": happiness → happy.
const SUFFIXES = [
  ['iness', ['y']], ['ness', ['']],
  ['ily', ['y']], ['ally', ['al', 'ic', '']], ['ly', ['', 'le', 'e']],
  ['ied', ['y']], ['ed', ['', 'e', '*']], ['ing', ['', 'e', '*']], ['iage', ['y']],
  ['ment', ['', 'e']],
  ['ication', ['y']], ['ation', ['ate', 'e', '']], ['ition', ['ite', 'ish']], ['ution', ['ute', 've']],
  ['tion', ['te', 't', 'e']], ['sion', ['de', 'se', 'd', 't']], ['ion', ['', 'e']],
  ['ier', ['y']], ['yer', ['']], ['er', ['', 'e', '*']], ['or', ['', 'e']],
  ['ist', ['', 'e', 'y', 'o', 's']], ['ician', ['ics', 'ic']], ['ian', ['', 'e', 'y']], ['ism', ['', 'e']],
  ['iful', ['y']], ['ful', ['']], ['less', ['']],
  ['ic', ['y']], ['ical', ['ics', 'ic']], ['y', ['', 'e', '*']],
  ['ial', ['y', 'e']], ['al', ['', 'e']], ['ability', ['able']], ['ibility', ['ible']], ['ity', ['', 'e']], ['ty', ['', 'e']],
  ['ive', ['', 'e']], ['ure', ['', 'e']],
  ['ence', ['ent', '', 'e']], ['ance', ['ant', '', 'e']], ['ous', ['', 'e']], ['able', ['', 'e']],
  ['en', ['', '*']], ['ship', ['']], ['hood', ['']], ['dom', ['']], ['th', ['']], ['ery', ['e', '', '*']], ['ry', ['']],
  ['ess', ['', 'e', 'er', 'or']], ['ise', ['', 'e']],
]
const PREFIXES = ['un', 'dis', 'im', 'in', 'ir', 'il', 're', 'mis', 'non', 'over', 'under']

function bases(w) {
  const out = []
  for (const [suf, reps] of SUFFIXES) {
    if (!w.endsWith(suf) || w.length - suf.length < 2) continue
    const stem = w.slice(0, -suf.length)
    // "*" undoes a doubled final consonant: stopped → stop, sunny → sun.
    for (const r of reps) out.push(r === '*' ? (stem.at(-1) === stem.at(-2) ? stem.slice(0, -1) : '') : stem + r)
  }
  for (const p of PREFIXES) if (w.startsWith(p)) out.push(w.slice(p.length))
  return [...new Set(out)].filter((b) => b.length >= 3 && b !== w && has(b))
}

// Reviewed links that are wrong for a learner: the words only look alike, or the base word in
// the data carries another meaning (train = tàu hỏa, kind = loại, please = làm ơn, park = công viên).
const NOT_FAMILY = new Set(
  `youth > you; curly > cure; carry > car; remain > main; return > turn; repair > pair; improve > prove;
  apply > app; apply > apple; feed > fee; remove > move; replace > place; organise > organ; shower > show;
  ready > read; final > fine; likely > like; tiny > tin; massive > mass; suitable > suit; minor > mine;
  busy > bus; tidy > tide; they > the; every > ever; inside > side; evening > even; early > ear;
  recent > cent; lately > late; overnight > night; many > man; beer > bee; butter > but; bitter > bit;
  apartment > apart; drawer > draw; basement > base; customer > custom; sweater > sweat; jumper > jump;
  clothing > cloth; earring > ear; sandal > sand; slipper > slip; trainer > train; discount > count;
  refund > fund; counter > count; formal > form; tooth > too; shoulder > should; waist > way;
  recover > cover; shy > she; kindness > kind; passion > past; passion > pass; corner > corn; rubber > rub;
  layer > lay; country > count; underpass > pass; county > count; mayor > may; station > state;
  resort > sort; reserve > serve; underground > ground; earth > ear; north > nor; flower > flow;
  seed > see; petal > pet; university > universe; ruler > rule; review > view; nursery > nurse;
  boarding > board; folder > fold; career > care; report > port; engineer > engine; director > direct;
  factory > factor; department > depart; overtime > time; presentation > present; presence > present;
  tailor > tail; miner > mine; mineral > miner; resign > sign; dismiss > miss; business > busy;
  income > come; invest > vest; offer > off; import > port; importance > import; retail > tail;
  invoice > voice; image > age; signal > sign; display > play; router > route; charger > charge;
  streaming > stream; inbox > box; server > serve; projector > project; party > part; toy > toe;
  fitness > fit; boxing > box; indoor > door; listen > list; letter > let; comment > come;
  inform > form; understand > stand; remember > member; realise > real; recall > call; bother > both;
  impress > press; only > one; hardly > hard; thing > the; matter > mat; mistake > take; factor > fact;
  reaction > action; story > store; legal > leg; army > arm; policy > police; official > office;
  authority > author; trial > try; research > search; discover > cover; recycling > cycling;
  chemistry > chemist; resource > source; pleased > please; parking > park; direction > direct;
  training > train; fairly > fair; basic > base; topic > top; pressure > press; pleasure > please;
  creature > create; physical > physics; forty > for; property > proper; onion > one; billion > bill;
  salty > sale; finance > fine; unwell > well; nervous > nerve`
    .split(';')
    .map((s) => s.trim()),
)

// Families the suffix rules cannot find (irregular forms, numbers).
const EXTRA_FAMILY = groups(`
  marry, marriage
  die, death, dead
  live, life, alive
  lose, loss, lost
  high, height
  long, length
  wide, width
  deep, depth
  hot, heat
  hungry, hunger
  angry, anger
  proud, pride
  shame, ashamed
  true, truth
  poor, poverty
  safe, safety
  choose, choice
  believe, belief
  think, thought
  succeed, success
  fly, flight
  sell, sale
  sing, song
  speak, speech
  poem, poet
  photo, photograph
  breathe, breath
  behave, behaviour
  respond, response
  advise, advice
  complain, complaint
  apologise, apology
  pronounce, pronunciation
  compare, comparison
  memory, memorise
  thank, thanks
  earn, earnings
  exam, examination
  pleased, pleasure
  clothes, clothing
  actor, actress
  training, trainee
  medicine, medical
  crime, criminal
  society, social
  religion, religious
  science, scientist, scientific
  chemical, chemistry
  economy, economic, economics
  compete, competition, competitor
  depend, independent
  unemployed, employ
  hope, hopefully
  three, third, thirteen, thirty
  four, fourth, fourteen, forty
  five, fifth, fifteen, fifty
  six, sixth, sixteen, sixty
  seven, seventh, seventeen, seventy
  eight, eighth, eighteen, eighty
  nine, ninth, nineteen, ninety
`)

const parent = new Map()
const find = (w) => (parent.get(w) === w ? w : find(parent.get(w)))
const union = (a, b) => {
  for (const w of [a, b]) if (!parent.has(w)) parent.set(w, w)
  parent.set(find(a), find(b))
}
const pairs = []
for (const w of order.keys()) {
  if (!/^[a-z]+$/.test(w)) continue
  for (const b of bases(w)) {
    if (NOT_FAMILY.has(`${w} > ${b}`)) continue
    union(w, b)
    pairs.push(`${w} > ${b}`)
  }
}

// Words of one synonym group share a meaning (in the sense the data gives them).
const SYNONYMS = groups(`
  big, large
  huge, enormous, giant, massive
  small, little, tiny
  begin, start
  finish, complete
  fast, quick, rapid
  happy, glad, pleased, delighted
  angry, mad
  afraid, scared, frightened
  clever, intelligent, smart
  stupid, silly
  crazy, mad
  terrible, awful, horrible
  wonderful, fantastic, amazing, brilliant
  beautiful, pretty
  difficult, hard
  easy, simple
  correct, right
  quiet, silent
  sure, certain
  necessary, essential
  important, significant
  usual, normal, ordinary
  whole, entire
  suitable, appropriate, proper
  clear, obvious
  complex, complicated
  extra, additional
  specific, particular
  loud, noisy
  tidy, neat
  slim, thin
  wide, broad
  nice, pleasant
  short, brief
  precious, valuable
  rich, wealthy
  ill, sick, unwell
  nervous, anxious, worried
  calm, relaxed
  embarrassed, ashamed
  surprised, amazed
  emotion, feeling
  character, personality
  shop, store
  buy, purchase
  choose, pick
  talk, speak
  answer, reply, respond
  help, aid
  trip, journey
  holiday, vacation
  film, movie
  photo, photograph
  picture, image
  mum, mother
  dad, father
  grandma, grandmother
  grandpa, grandfather
  kid, child
  baby, infant
  friend, mate
  partner, spouse
  wedding, marriage
  man, guy
  woman, lady
  job, occupation, profession
  boss, manager
  colleague, coworker
  hire, employ
  quit, resign
  sack, dismiss
  salary, wage
  income, earnings
  company, firm, corporation
  client, customer
  cost, expense
  fee, charge
  bill, invoice
  wealth, fortune
  lorry, truck
  subway, metro, underground
  pavement, sidewalk
  motorway, highway
  petrol, fuel, gas
  port, harbour
  abroad, overseas
  tourist, visitor
  jumper, sweater
  trainer, sneaker
  purse, wallet
  cart, trolley
  shopping centre, mall
  cooker, oven
  lounge, living room
  cupboard, cabinet
  carpet, rug
  illness, disease
  hurt, injure
  wound, injury
  ache, pain
  medicine, drug
  pharmacy, chemist
  surgery, operation
  heal, cure
  sea, ocean
  coast, shore
  rock, stone
  fog, mist
  sunshine, sunlight
  sunrise, dawn
  hurricane, typhoon
  jungle, rainforest
  animal, creature, beast
  student, pupil, learner
  headteacher, headmaster, principal
  exam, examination, test
  maths, mathematics
  term, semester
  revise, review
  cloth, fabric
  error, mistake
  kind, sort, type
  problem, issue
  chance, opportunity
  result, consequence
  effect, impact
  opinion, view
  topic, theme
  stuff, thing
  maybe, perhaps
  almost, nearly
  often, frequently
  rarely, seldom
  usually, normally, generally
  completely, totally, entirely, fully
  mostly, mainly, largely
  certainly, definitely, surely
  finally, eventually
  lately, recently
  close, shut
  fix, repair
  raise, lift
  allow, permit, let
  forbid, ban
  increase, rise
  reduce, decrease
  gather, collect
  hurry, rush
  shout, scream
  hit, beat
  steal, rob
  prison, jail
  nation, country
  area, region
  road, street
  path, footpath
  intersection, junction, crossroads
  suburb, outskirts
  resident, inhabitant
  castle, palace
  landmark, monument
  county, province
  location, site
  middle, centre
  remember, recall
  guess, suppose, reckon
  want, desire, wish
  like, enjoy
  scare, frighten
  annoy, bother
  amaze, surprise
  search, seek
  focus, concentrate
  decide, determine
  notice, observe
  mix, combine
  produce, manufacture
  create, make
  stay, remain
  present, gift
  conversation, dialogue
  advert, advertisement
  wire, cable
  device, gadget
  screen, display, monitor
  match, game
  contest, competition
  opponent, competitor
  hobby, pastime
  leisure, free time
  sportsman, athlete
  song, tune
  writer, author
  tradition, custom
  legend, myth
  statue, sculpture
  festival, carnival
  safety, security
  energy, power
  rubbish, waste
  annual, yearly
  noon, midday
  schedule, timetable
  era, period
  amount, quantity
  lot, plenty
  piece, bit
  number, figure
`)

// Pairs of opposites.
const ANTONYMS = groups(`
  big, small
  large, small
  long, short
  tall, short
  high, low
  new, old
  young, old
  good, bad
  easy, difficult
  easy, hard
  hot, cold
  warm, cool
  fast, slow
  quick, slow
  quickly, slowly
  rich, poor
  happy, sad
  happiness, sadness
  buy, sell
  buyer, seller
  open, close
  open, shut
  start, finish
  begin, end
  beginning, end
  come, go
  give, take
  push, pull
  win, lose
  victory, defeat
  lend, borrow
  teach, learn
  question, answer
  ask, answer
  remember, forget
  love, hate
  accept, refuse
  agree, disagree
  admit, deny
  believe, doubt
  allow, forbid
  arrive, leave
  arrive, depart
  arrival, departure
  entrance, exit
  increase, decrease
  increase, reduce
  rise, fall
  float, sink
  succeed, fail
  success, failure
  pass, fail
  advantage, disadvantage
  true, false
  right, wrong
  possible, impossible
  likely, unlikely
  usual, unusual
  useful, useless
  careful, careless
  skilled, unskilled
  clean, dirty
  tidy, messy
  full, empty
  heavy, light
  thick, thin
  fat, thin
  wide, narrow
  deep, shallow
  loud, quiet
  noisy, quiet
  soft, hard
  strong, weak
  safe, dangerous
  cheap, expensive
  early, late
  first, last
  next, previous
  before, after
  above, below
  inside, outside
  up, down
  in, out
  on, off
  with, without
  always, never
  often, rarely
  together, apart
  luckily, unfortunately
  well, badly
  everything, nothing
  everybody, nobody
  everyone, nobody
  everywhere, nowhere
  all, none
  yes, no
  man, woman
  boy, girl
  mother, father
  mum, dad
  son, daughter
  brother, sister
  husband, wife
  boyfriend, girlfriend
  uncle, aunt
  nephew, niece
  grandmother, grandfather
  grandma, grandpa
  grandson, granddaughter
  bride, groom
  male, female
  king, queen
  prince, princess
  actor, actress
  sportsman, sportswoman
  birth, death
  life, death
  alive, dead
  single, married
  adult, child
  host, guest
  teacher, student
  employer, employee
  landlord, tenant
  north, south
  east, west
  top, bottom
  sunrise, sunset
  day, night
  morning, evening
  past, future
  yesterday, tomorrow
  summer, winter
  import, export
  profit, loss
  deposit, withdraw
  supply, demand
  wealth, poverty
  majority, minority
  peace, war
  guilty, innocent
  legal, illegal
  public, private
  friend, enemy
  positive, negative
  polite, rude
  clever, stupid
  lazy, hardworking
  generous, selfish
  calm, nervous
  confident, shy
  interesting, boring
  exciting, boring
  excited, bored
  laugh, cry
  pride, shame
  pleasure, pain
  sweet, bitter
  wet, dry
  asleep, awake
  sleep, wake
  black, white
  bright, dark
  light, dark
  smooth, rough
  solid, liquid
  sharp, dull
  freeze, melt
  indoor, outdoor
  upstairs, downstairs
  online, offline
  upload, download
  lock, unlock
  appear, disappear
  send, receive
  punish, reward
  throw, catch
  hide, show
  find, lose
  save, spend
  ancient, modern
  beautiful, ugly
  simple, complicated
  general, specific
  major, minor
  maximum, minimum
  rural, urban
  native, foreign
  plus, minus
  multiply, divide
  absent, present
  presence, absence
  mental, physical
  healthy, ill
  natural, artificial
  virtual, real
  hardware, software
  build, destroy
  create, destroy
  damage, repair
  remove, add
  survive, die
`)

const clean = (gs) => {
  const missing = new Set()
  const out = gs
    .map((g) => g.filter((w) => has(w) || !missing.add(w)))
    .filter((g) => g.length >= 2)
    .map((g) => g.sort(byOrder))
  return { out, missing: [...missing] }
}
for (const [a, ...rest] of clean(EXTRA_FAMILY).out) for (const b of rest) union(a, b)
const families = new Map()
for (const w of parent.keys()) families.set(find(w), [...(families.get(find(w)) ?? []), w])

const syn = clean(SYNONYMS)
const ant = clean(ANTONYMS)
const sortGroups = (gs) => gs.sort((a, b) => byOrder(a[0], b[0]) || byOrder(a[1], b[1]))
const relations = {
  family: sortGroups([...families.values()].map((g) => g.sort(byOrder))),
  synonym: sortGroups(syn.out),
  antonym: sortGroups(ant.out),
}

if (process.argv.includes('--write')) {
  // One group per line keeps the file easy to review in a diff.
  const body = Object.entries(relations)
    .map(([k, gs]) => `  "${k}": [\n${gs.map((g) => `    ${JSON.stringify(g)}`).join(',\n')}\n  ]`)
    .join(',\n')
  writeFileSync(new URL('data/relations.json', root), `{\n${body}\n}\n`)
}
if (process.argv.includes('--pairs')) console.log(pairs.join('\n'))
else for (const [k, gs] of Object.entries(relations)) console.log(`${k} (${gs.length}):\n${gs.map((g) => '  ' + g.join(', ')).join('\n')}`)
const missing = [...new Set([...syn.missing, ...ant.missing, ...clean(EXTRA_FAMILY).missing])]
if (missing.length) console.log(`\nNot in the core words, skipped: ${missing.join(', ')}`)
