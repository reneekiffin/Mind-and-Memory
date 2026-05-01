// games/biblestories.js — Bible Stories trivia (Old & New Testament)

let bsScore = 0;
let bsQ     = 0;
let bsPool  = null;

function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TRIVIA = [
  // ── Genesis ────────────────────────────────────────────
  { section:'Genesis', q:'On which day did God create man and woman?', a:'The sixth day', choices:['The third day','The fifth day','The sixth day','The seventh day'], fact:'In Genesis 1, God creates humanity on the sixth day, then rests on the seventh.' },
  { section:'Genesis', q:'What did God form Adam from?', a:'The dust of the ground', choices:['The dust of the ground','A rib','A river of water','A garden plant'], fact:'Genesis 2:7 says the Lord formed the man from the dust of the ground and breathed into his nostrils the breath of life.' },
  { section:'Genesis', q:'From what did God create Eve?', a:'A rib taken from Adam', choices:['Clay','A rib taken from Adam','A breath of wind','A drop of water'], fact:'In Genesis 2:21-22, God took one of Adam\'s ribs while he slept and made it into a woman.' },
  { section:'Genesis', q:'What forbidden fruit did Adam and Eve eat?', a:'The fruit of the tree of the knowledge of good and evil', choices:['A fig','The fruit of the tree of the knowledge of good and evil','A pomegranate','A cluster of grapes'], fact:'Genesis 3 names the tree of the knowledge of good and evil — the Bible never specifies which fruit it was.' },
  { section:'Genesis', q:'Who tempted Eve to eat the forbidden fruit?', a:'A serpent', choices:['A lion','An angel','A serpent','A talking tree'], fact:'Genesis 3 describes the serpent as the most cunning of the wild animals; later tradition identified him with Satan.' },
  { section:'Genesis', q:'Who were the first two sons of Adam and Eve?', a:'Cain and Abel', choices:['Seth and Enoch','Cain and Abel','Jacob and Esau','Shem and Ham'], fact:'Cain became a tiller of the ground; Abel was a keeper of sheep (Genesis 4).' },
  { section:'Genesis', q:'Who killed his brother Abel?', a:'Cain', choices:['Cain','Esau','Lamech','Ishmael'], fact:'In Genesis 4, Cain killed Abel out of jealousy when God favoured Abel\'s offering.' },
  { section:'Genesis', q:'Who built an ark to survive a great flood?', a:'Noah', choices:['Abraham','Noah','Methuselah','Enoch'], fact:'Genesis 6-9 — Noah built the ark on God\'s instructions; he was 600 years old when the floodwaters came.' },
  { section:'Genesis', q:'For how many days and nights did the rain fall during the Flood?', a:'40 days and 40 nights', choices:['7 days and 7 nights','12 days and 12 nights','40 days and 40 nights','100 days and 100 nights'], fact:'Genesis 7:12 — the rains fell for forty days and forty nights.' },
  { section:'Genesis', q:'What sign did God give Noah after the Flood?', a:'A rainbow', choices:['A dove','A rainbow','A burning bush','A pillar of fire'], fact:'Genesis 9 — God set a rainbow in the clouds as the sign of the covenant never again to flood the earth.' },
  { section:'Genesis', q:'What was the tower people tried to build that reached toward heaven?', a:'The Tower of Babel', choices:['The Tower of Jericho','The Tower of David','The Tower of Babel','The Tower of Babylon'], fact:'In Genesis 11, God confused their languages so they could not finish the Tower of Babel.' },
  { section:'Genesis', q:'Who was Abraham\'s wife?', a:'Sarah', choices:['Rachel','Hagar','Sarah','Rebekah'], fact:'Sarah was barren until God promised her a son in old age — she gave birth to Isaac at 90 (Genesis 17-21).' },
  { section:'Genesis', q:'Whose son did God ask Abraham to sacrifice on Mount Moriah?', a:'Isaac', choices:['Ishmael','Isaac','Jacob','Esau'], fact:'In Genesis 22, God stopped Abraham at the last moment and provided a ram caught in a thicket.' },
  { section:'Genesis', q:'Who tricked his older brother Esau out of his birthright?', a:'Jacob', choices:['Joseph','Reuben','Jacob','Laban'], fact:'Genesis 25 — Esau sold his birthright for a bowl of stew. Jacob later received the blessing meant for Esau too.' },
  { section:'Genesis', q:'Joseph\'s coat is famously described as what?', a:'A coat of many colours', choices:['A coat of many colours','A purple robe','A linen tunic','A leather cloak'], fact:'Genesis 37 — Jacob made Joseph a richly ornamented robe, traditionally called "the coat of many colours".' },
  { section:'Genesis', q:'Where did Joseph rise to become second-in-command to Pharaoh?', a:'Egypt', choices:['Babylon','Egypt','Canaan','Persia'], fact:'After being sold into slavery and imprisoned, Joseph interpreted Pharaoh\'s dreams and was set over all Egypt (Genesis 41).' },

  // ── Exodus ─────────────────────────────────────────────
  { section:'Exodus', q:'In what was the baby Moses placed to escape Pharaoh\'s decree?', a:'A basket of bulrushes', choices:['A wooden cradle','A basket of bulrushes','A clay jar','A reed mat'], fact:'Exodus 2 — his mother coated the basket with tar and pitch and placed it among the reeds of the Nile.' },
  { section:'Exodus', q:'Who found baby Moses in the river?', a:'Pharaoh\'s daughter', choices:['Pharaoh\'s wife','Pharaoh\'s daughter','Moses\'s sister','An Egyptian priestess'], fact:'Pharaoh\'s daughter took pity on him and raised him as her own son (Exodus 2:5-10).' },
  { section:'Exodus', q:'From what burning object did God speak to Moses?', a:'A burning bush', choices:['A pillar of fire','A burning bush','A blazing altar','A flaming sword'], fact:'In Exodus 3, God called to Moses out of a bush that burned but was not consumed.' },
  { section:'Exodus', q:'Who was Moses\'s brother and spokesman?', a:'Aaron', choices:['Joshua','Caleb','Aaron','Korah'], fact:'God appointed Aaron to speak for the slow-of-tongue Moses (Exodus 4:14-16). He later became the first high priest.' },
  { section:'Exodus', q:'How many plagues did God send on Egypt?', a:'Ten', choices:['Seven','Ten','Twelve','Forty'], fact:'The ten plagues — water-to-blood, frogs, gnats, flies, livestock, boils, hail, locusts, darkness and the death of the firstborn — appear in Exodus 7-12.' },
  { section:'Exodus', q:'What was the first plague God sent on Egypt?', a:'Water turned to blood', choices:['Frogs','Locusts','Water turned to blood','Darkness'], fact:'Exodus 7 — Aaron struck the Nile with his staff and the water turned to blood.' },
  { section:'Exodus', q:'What was the final plague sent on Egypt?', a:'The death of every firstborn', choices:['Hail','Locusts','Darkness','The death of every firstborn'], fact:'Exodus 12 — the angel of death passed over the houses marked with lamb\'s blood, sparing the Israelites.' },
  { section:'Exodus', q:'What feast did God establish to remember Israel\'s deliverance from Egypt?', a:'The Passover', choices:['Pentecost','Tabernacles','Hanukkah','The Passover'], fact:'The Passover commemorates God passing over the homes whose doorposts were marked with blood (Exodus 12).' },
  { section:'Exodus', q:'What body of water did God part for the Israelites to cross?', a:'The Red Sea', choices:['The Jordan River','The Red Sea','The Sea of Galilee','The Mediterranean'], fact:'Exodus 14 — Moses stretched out his hand and the waters divided. The pursuing Egyptian army drowned when the waters returned.' },
  { section:'Exodus', q:'What food did God send from heaven to feed the Israelites in the wilderness?', a:'Manna', choices:['Quail','Manna','Honey','Locusts'], fact:'Each morning the Israelites gathered manna — a flake-like substance described as tasting like wafers made with honey (Exodus 16).' },
  { section:'Exodus', q:'On which mountain did God give Moses the Ten Commandments?', a:'Mount Sinai', choices:['Mount Carmel','Mount Sinai','Mount Zion','Mount Hermon'], fact:'Exodus 19-20 — God descended on Mount Sinai in fire and gave the Law to Israel.' },
  { section:'Exodus', q:'What golden object did the Israelites build and worship while Moses was on the mountain?', a:'A golden calf', choices:['A golden lion','A golden calf','A golden serpent','A golden bull'], fact:'In Exodus 32, Aaron made a golden calf from the people\'s jewellery while Moses was receiving the Law.' },
  { section:'Exodus', q:'On how many stone tablets were the Ten Commandments written?', a:'Two', choices:['One','Two','Three','Ten'], fact:'Exodus 31:18 — the testimony was on two tablets of stone, written with the finger of God.' },
  { section:'Exodus', q:'What sacred chest housed the tablets of the covenant?', a:'The Ark of the Covenant', choices:['The Ark of the Covenant','The Tabernacle','The Mercy Seat','The Bronze Altar'], fact:'The ark was an acacia-wood chest overlaid with gold, with two cherubim on its lid (Exodus 25).' },
  { section:'Exodus', q:'What pillar led the Israelites by night through the wilderness?', a:'A pillar of fire', choices:['A pillar of cloud','A pillar of fire','A pillar of smoke','A pillar of stars'], fact:'Exodus 13 — the Lord went before them by day in a pillar of cloud and by night in a pillar of fire.' },
  { section:'Exodus', q:'For how many years did the Israelites wander in the wilderness?', a:'Forty', choices:['Seven','Twelve','Forty','Seventy'], fact:'Numbers 14 — for their unbelief, the generation that left Egypt wandered forty years until they died in the wilderness.' },

  // ── Joshua, Judges & Ruth ─────────────────────────────
  { section:'Joshua', q:'Who led the Israelites into the Promised Land after Moses died?', a:'Joshua', choices:['Aaron','Joshua','Caleb','Eleazar'], fact:'God commissioned Joshua to lead Israel across the Jordan into Canaan (Joshua 1).' },
  { section:'Joshua', q:'What city\'s walls fell after the Israelites marched around it?', a:'Jericho', choices:['Ai','Jericho','Hebron','Bethel'], fact:'Joshua 6 — for six days they marched once around the walls; on the seventh day they marched seven times, blew trumpets, and the walls collapsed.' },
  { section:'Joshua', q:'For how many days did the Israelites march around Jericho before its walls fell?', a:'Seven', choices:['Three','Six','Seven','Twelve'], fact:'Joshua 6 — they circled the city once each day for six days and seven times on the seventh day.' },
  { section:'Joshua', q:'Who hid the two Israelite spies in Jericho?', a:'Rahab', choices:['Deborah','Rahab','Jael','Hannah'], fact:'Rahab hid the spies under stalks of flax on her roof and was spared when Jericho fell (Joshua 2 & 6).' },
  { section:'Judges', q:'Who was the female judge of Israel who led with the warrior Barak?', a:'Deborah', choices:['Esther','Deborah','Miriam','Hannah'], fact:'Judges 4-5 — Deborah summoned Barak and together they defeated the Canaanite commander Sisera.' },
  { section:'Judges', q:'Who drove a tent peg through the head of the Canaanite commander Sisera?', a:'Jael', choices:['Deborah','Jael','Rahab','Delilah'], fact:'Judges 4 — Jael lulled Sisera to sleep, then drove a tent peg through his temple.' },
  { section:'Judges', q:'How many soldiers did Gideon take to defeat the Midianites?', a:'300', choices:['100','300','1,000','3,000'], fact:'Judges 7 — God whittled Gideon\'s army down to 300 men, who routed the Midianites with trumpets and torches.' },
  { section:'Judges', q:'In what was the source of Samson\'s great strength?', a:'His uncut hair', choices:['His sword','His uncut hair','A magic stone','A blessed cloak'], fact:'As a Nazirite from birth, Samson\'s strength was tied to his uncut hair (Judges 13-16).' },
  { section:'Judges', q:'Who tricked Samson into revealing the secret of his strength?', a:'Delilah', choices:['Jezebel','Delilah','Bathsheba','Salome'], fact:'Judges 16 — Delilah pestered Samson until he confessed, then had his head shaved while he slept.' },
  { section:'Judges', q:'What did Samson do at the temple of Dagon at the end of his life?', a:'He pushed down the temple pillars', choices:['He set the temple on fire','He pushed down the temple pillars','He smote the priests with a jawbone','He toppled the idol of Dagon'], fact:'Judges 16 — strength returned, Samson pushed apart the two central pillars and the temple collapsed on him and the Philistines.' },
  { section:'Ruth', q:'Whom did Ruth refuse to leave, saying "where you go, I will go"?', a:'Naomi, her mother-in-law', choices:['Boaz','Naomi, her mother-in-law','Orpah','Mahlon'], fact:'Ruth 1:16 — "Whither thou goest, I will go… thy people shall be my people, and thy God my God."' },
  { section:'Ruth', q:'Whom did Ruth marry in the town of Bethlehem?', a:'Boaz', choices:['Boaz','Mahlon','Obed','Eli'], fact:'Boaz was a kinsman-redeemer; their son Obed was the grandfather of King David (Ruth 4).' },

  // ── Samuel, Saul & David ──────────────────────────────
  { section:'Samuel', q:'Who was the prophet who anointed both Saul and David as king?', a:'Samuel', choices:['Eli','Samuel','Nathan','Elijah'], fact:'1 Samuel — Samuel anointed Saul as Israel\'s first king and later anointed David in Bethlehem.' },
  { section:'Samuel', q:'What was the name of Samuel\'s mother, who prayed for a son at the temple?', a:'Hannah', choices:['Hannah','Sarah','Rebekah','Rachel'], fact:'1 Samuel 1 — Hannah prayed silently at the temple; God answered with the birth of Samuel.' },
  { section:'Samuel', q:'Who was the first king of Israel?', a:'Saul', choices:['David','Saul','Solomon','Samuel'], fact:'1 Samuel 9-10 — Saul, son of Kish from the tribe of Benjamin, was anointed Israel\'s first king.' },
  { section:'David', q:'Whom did the boy David defeat with a sling and a stone?', a:'Goliath', choices:['Saul','Goliath','Sisera','Achish'], fact:'1 Samuel 17 — David struck the Philistine champion Goliath in the forehead with a single smooth stone.' },
  { section:'David', q:'How many smooth stones did David choose from the brook before facing Goliath?', a:'Five', choices:['Three','Five','Seven','Twelve'], fact:'1 Samuel 17:40 — though he selected five, David needed only one to fell Goliath.' },
  { section:'David', q:'Who was David\'s closest friend, the son of King Saul?', a:'Jonathan', choices:['Absalom','Jonathan','Joab','Solomon'], fact:'1 Samuel 18 — Jonathan loved David as his own soul and risked his father\'s wrath to protect him.' },
  { section:'David', q:'What was the name of David\'s son who rebelled against him?', a:'Absalom', choices:['Solomon','Absalom','Amnon','Adonijah'], fact:'2 Samuel 15-18 — Absalom led a revolt; he died when his hair caught in an oak tree as he fled on a mule.' },
  { section:'David', q:'Whose husband did David have killed so he could marry her?', a:'Bathsheba', choices:['Bathsheba','Michal','Abigail','Tamar'], fact:'2 Samuel 11 — David sent Uriah the Hittite to die in battle so he could marry Bathsheba.' },
  { section:'David', q:'Which prophet confronted David over his sin with Bathsheba?', a:'Nathan', choices:['Samuel','Nathan','Elijah','Isaiah'], fact:'2 Samuel 12 — Nathan told David the parable of the rich man who stole the poor man\'s ewe lamb.' },
  { section:'Solomon', q:'Who succeeded David as king of Israel?', a:'Solomon', choices:['Absalom','Adonijah','Solomon','Rehoboam'], fact:'1 Kings 1-2 — Solomon, son of David and Bathsheba, was crowned king while David was still alive.' },
  { section:'Solomon', q:'For what did Solomon famously ask God in a dream?', a:'Wisdom', choices:['Riches','Long life','Wisdom','Victory in battle'], fact:'1 Kings 3 — pleased that he asked for wisdom rather than wealth, God gave Solomon both.' },
  { section:'Solomon', q:'In Solomon\'s famous judgement, what did he threaten to do to settle two women\'s claim over a baby?', a:'Cut the baby in two', choices:['Banish both women','Cut the baby in two','Send the baby to the temple','Cast lots'], fact:'1 Kings 3 — the true mother begged him to spare the child, revealing her identity.' },
  { section:'Solomon', q:'What great structure did Solomon build in Jerusalem?', a:'The Temple', choices:['The Tabernacle','The Temple','The Tower of David','The Walls of Jerusalem'], fact:'1 Kings 6 — Solomon built the First Temple over seven years, using cedar from Lebanon and gold from Ophir.' },
  { section:'Solomon', q:'Which queen visited Solomon to test him with hard questions?', a:'The Queen of Sheba', choices:['The Queen of Sheba','Queen Jezebel','Queen Esther','The Queen of Egypt'], fact:'1 Kings 10 — she came with a great caravan to test Solomon and was overwhelmed by his wisdom and wealth.' },

  // ── Prophets — Elijah & Elisha ────────────────────────
  { section:'Elijah', q:'Who fed Elijah by the brook Cherith during a great drought?', a:'Ravens', choices:['Doves','Ravens','Sparrows','Eagles'], fact:'1 Kings 17 — God commanded ravens to bring Elijah bread and meat morning and evening.' },
  { section:'Elijah', q:'On which mountain did Elijah defeat the prophets of Baal?', a:'Mount Carmel', choices:['Mount Sinai','Mount Carmel','Mount Tabor','Mount Gilboa'], fact:'1 Kings 18 — fire from heaven consumed Elijah\'s soaked sacrifice while Baal\'s prophets called out in vain.' },
  { section:'Elijah', q:'Who was the wicked queen who sought to kill Elijah?', a:'Jezebel', choices:['Athaliah','Jezebel','Herodias','Vashti'], fact:'1 Kings 19 — Jezebel, wife of King Ahab, vowed to kill Elijah after he slew her prophets of Baal.' },
  { section:'Elijah', q:'How did Elijah depart this earth?', a:'In a chariot of fire', choices:['He died of old age','In a chariot of fire','By the hand of an enemy','By drowning in the Jordan'], fact:'2 Kings 2 — a chariot and horses of fire took Elijah up by a whirlwind into heaven, with Elisha looking on.' },
  { section:'Elisha', q:'What did Elisha receive from Elijah as he was taken up?', a:'A double portion of his spirit', choices:['A bag of silver','A scroll of prophecy','A double portion of his spirit','Elijah\'s sandals'], fact:'2 Kings 2:9-10 — Elisha asked for a double portion; he picked up the cloak Elijah dropped and parted the Jordan with it.' },
  { section:'Elisha', q:'What did Elisha do to feed a hundred men with twenty barley loaves?', a:'He multiplied the loaves so all ate and had leftovers', choices:['Sent them away hungry','Bought more from a merchant','He multiplied the loaves so all ate and had leftovers','Asked God to send manna'], fact:'2 Kings 4:42-44 — a foreshadowing of Jesus\'s feeding miracles centuries later.' },
  { section:'Elisha', q:'Which Syrian commander did Elisha heal of leprosy by sending him to wash in the Jordan?', a:'Naaman', choices:['Hazael','Naaman','Ben-Hadad','Sennacherib'], fact:'2 Kings 5 — Naaman dipped seven times in the Jordan and his flesh was restored like a young boy\'s.' },
  { section:'Isaiah', q:'Which prophet saw the Lord seated on a throne with seraphim crying "Holy, holy, holy"?', a:'Isaiah', choices:['Ezekiel','Daniel','Isaiah','Jeremiah'], fact:'Isaiah 6 — a seraph touched Isaiah\'s lips with a burning coal to cleanse him before sending him to prophesy.' },
  { section:'Jeremiah', q:'Which prophet is often called the "weeping prophet"?', a:'Jeremiah', choices:['Isaiah','Jeremiah','Ezekiel','Hosea'], fact:'Jeremiah ministered as Jerusalem fell to Babylon and wrote the book of Lamentations.' },
  { section:'Ezekiel', q:'Which prophet saw a valley filled with dry bones come to life?', a:'Ezekiel', choices:['Isaiah','Jeremiah','Ezekiel','Daniel'], fact:'Ezekiel 37 — God commanded him to prophesy to the bones, which came together with sinews, flesh, and breath as a vast army.' },

  // ── Daniel ────────────────────────────────────────────
  { section:'Daniel', q:'In whose den was Daniel cast for praying to God?', a:'Lions', choices:['Lions','Bears','Wolves','Serpents'], fact:'Daniel 6 — Daniel was thrown into the lions\' den; God shut the lions\' mouths and he was unharmed.' },
  { section:'Daniel', q:'How many of Daniel\'s friends were thrown into the fiery furnace?', a:'Three', choices:['One','Two','Three','Four'], fact:'Daniel 3 — Shadrach, Meshach and Abednego refused to bow to Nebuchadnezzar\'s golden image. A fourth figure walked with them in the flames.' },
  { section:'Daniel', q:'What were the names of Daniel\'s three friends in the furnace?', a:'Shadrach, Meshach and Abednego', choices:['Shadrach, Meshach and Abednego','Hananiah, Mishael and Azariah (their Hebrew names)','Aleph, Bet and Gimel','Eli, Eliab and Eldad'], fact:'They were given Babylonian names; their Hebrew names were Hananiah, Mishael and Azariah.' },
  { section:'Daniel', q:'What mysterious writing appeared on the wall at King Belshazzar\'s feast?', a:'MENE, MENE, TEKEL, UPHARSIN', choices:['ALPHA AND OMEGA','MENE, MENE, TEKEL, UPHARSIN','HOLY, HOLY, HOLY','REPENT AND BELIEVE'], fact:'Daniel 5 — the words foretold that Belshazzar\'s kingdom was numbered, weighed and divided. He was killed that same night.' },

  // ── Esther ────────────────────────────────────────────
  { section:'Esther', q:'Which Jewish queen risked her life to save her people from destruction?', a:'Esther', choices:['Vashti','Esther','Bathsheba','Deborah'], fact:'Esther 4-7 — Esther approached King Xerxes uninvited and exposed Haman\'s plot to destroy the Jews.' },
  { section:'Esther', q:'Who plotted to destroy the Jews in the book of Esther?', a:'Haman', choices:['Mordecai','Haman','Hamor','Holofernes'], fact:'Esther 3 — Haman was angered when Mordecai would not bow; he was eventually hanged on the gallows he built for Mordecai.' },
  { section:'Esther', q:'What feast do Jews still celebrate to remember Esther\'s deliverance of her people?', a:'Purim', choices:['Hanukkah','Purim','Passover','Pentecost'], fact:'Esther 9 — Purim is named for the "pur" (lots) Haman cast to choose the day of destruction.' },

  // ── Jonah ─────────────────────────────────────────────
  { section:'Jonah', q:'In what was Jonah swallowed when he tried to flee from God?', a:'A great fish', choices:['A whale','A great fish','A leviathan','A serpent'], fact:'Jonah 1-2 — the Bible says "a great fish"; for three days and nights Jonah was inside its belly before it spat him out on dry land.' },
  { section:'Jonah', q:'To which city was Jonah called to preach repentance?', a:'Nineveh', choices:['Babylon','Nineveh','Tyre','Tarshish'], fact:'Jonah 3 — when Jonah finally preached, the people of Nineveh repented in sackcloth and ashes, and God spared the city.' },

  // ── Job ───────────────────────────────────────────────
  { section:'Job', q:'Who lost his wealth, family and health yet refused to curse God?', a:'Job', choices:['Joseph','Job','Jeremiah','Joshua'], fact:'The book of Job — Satan was permitted to test Job, who declared "though he slay me, yet will I trust him".' },
  { section:'Job', q:'How many friends came to comfort Job and ended up debating his suffering?', a:'Three', choices:['Two','Three','Four','Seven'], fact:'Eliphaz, Bildad and Zophar sat with Job seven days in silence before speaking (Job 2-3).' },

  // ── Birth of Jesus ───────────────────────────────────
  { section:'Birth of Jesus', q:'Which angel told Mary she would give birth to Jesus?', a:'Gabriel', choices:['Michael','Gabriel','Raphael','Uriel'], fact:'Luke 1:26-38 — Gabriel was sent from God to a virgin in Nazareth named Mary.' },
  { section:'Birth of Jesus', q:'In what town was Jesus born?', a:'Bethlehem', choices:['Nazareth','Bethlehem','Jerusalem','Capernaum'], fact:'Luke 2 — Mary and Joseph travelled to Bethlehem for the census; she gave birth there in a stable.' },
  { section:'Birth of Jesus', q:'Why did Mary lay Jesus in a manger?', a:'Because there was no room for them in the inn', choices:['To hide him from Herod','Because there was no room for them in the inn','Because the temple was closed','Because she was on a journey'], fact:'Luke 2:7 — she wrapped him in cloths and laid him in a manger because there was no place for them in the inn.' },
  { section:'Birth of Jesus', q:'To whom did the angels first announce Jesus\'s birth?', a:'Shepherds in the fields', choices:['Roman soldiers','Shepherds in the fields','Temple priests','Innkeepers'], fact:'Luke 2:8-14 — a multitude of the heavenly host appeared to shepherds tending their flocks by night.' },
  { section:'Birth of Jesus', q:'What three gifts did the wise men bring to Jesus?', a:'Gold, frankincense and myrrh', choices:['Bread, wine and oil','Gold, frankincense and myrrh','Silver, gold and bronze','Wheat, oil and incense'], fact:'Matthew 2 — the magi from the east presented these gifts when they found the child with his mother.' },
  { section:'Birth of Jesus', q:'What did the wise men follow to find the baby Jesus?', a:'A star', choices:['A pillar of fire','A star','A bright cloud','A flying dove'], fact:'Matthew 2:9 — the star they had seen in the east went ahead of them until it stopped over the place where the child was.' },
  { section:'Birth of Jesus', q:'Which king tried to kill the baby Jesus?', a:'Herod the Great', choices:['Pontius Pilate','Caesar Augustus','Herod the Great','Nebuchadnezzar'], fact:'Matthew 2 — fearing a rival king, Herod ordered all baby boys in Bethlehem under two years old to be killed.' },
  { section:'Birth of Jesus', q:'To which country did Joseph and Mary flee with Jesus to escape Herod?', a:'Egypt', choices:['Egypt','Syria','Persia','Greece'], fact:'Matthew 2:13-15 — an angel warned Joseph in a dream to flee to Egypt until Herod\'s death.' },
  { section:'Birth of Jesus', q:'What was the name of Mary\'s relative whose son became John the Baptist?', a:'Elizabeth', choices:['Anna','Salome','Elizabeth','Joanna'], fact:'Luke 1 — Elizabeth, formerly barren, conceived John in her old age, six months before Mary conceived Jesus.' },
  { section:'Birth of Jesus', q:'Where did Jesus astonish the teachers when he was twelve years old?', a:'In the temple in Jerusalem', choices:['In the synagogue at Nazareth','By the Sea of Galilee','In the temple in Jerusalem','At Jacob\'s well'], fact:'Luke 2:41-52 — his parents found him after three days, sitting among the teachers, listening and asking questions.' },

  // ── Jesus\'s Ministry ─────────────────────────────────
  { section:'Ministry', q:'Who baptised Jesus in the Jordan River?', a:'John the Baptist', choices:['Peter','John the Baptist','Andrew','Philip'], fact:'Matthew 3 — as Jesus came up out of the water, the Spirit descended like a dove and a voice from heaven affirmed him.' },
  { section:'Ministry', q:'How many days and nights did Jesus fast in the wilderness?', a:'Forty', choices:['Three','Twelve','Forty','Seventy'], fact:'Matthew 4 — after his fast, Satan tempted Jesus three times and Jesus answered each with Scripture.' },
  { section:'Ministry', q:'How many disciples did Jesus call as his closest followers?', a:'Twelve', choices:['Seven','Ten','Twelve','Seventy'], fact:'Matthew 10 — Jesus chose twelve apostles and gave them authority to preach and to heal.' },
  { section:'Ministry', q:'Which two brothers were fishermen who became Jesus\'s first disciples?', a:'Peter and Andrew', choices:['James and John','Peter and Andrew','Philip and Bartholomew','Matthew and Thomas'], fact:'Matthew 4:18-20 — Jesus called them by the Sea of Galilee saying, "Follow me, and I will make you fishers of men."' },
  { section:'Ministry', q:'Which disciple was a tax collector before following Jesus?', a:'Matthew', choices:['Peter','Matthew','Thomas','Judas'], fact:'Matthew 9:9 — Jesus called him as he sat at the tax booth; tradition holds he wrote the first Gospel.' },
  { section:'Ministry', q:'Which disciple is famously called "the doubter" for asking to touch Jesus\'s wounds?', a:'Thomas', choices:['Peter','Thomas','Bartholomew','Andrew'], fact:'John 20:24-29 — "Doubting Thomas" later confessed Jesus as "My Lord and my God".' },
  { section:'Ministry', q:'Where did Jesus deliver the sermon containing the Beatitudes?', a:'On a mountain', choices:['In the temple','On a mountain','In a boat','In the desert'], fact:'Matthew 5-7 — the Sermon on the Mount; "Blessed are the poor in spirit, for theirs is the kingdom of heaven".' },
  { section:'Ministry', q:'What prayer did Jesus teach his disciples in the Sermon on the Mount?', a:'The Lord\'s Prayer', choices:['The Hail Mary','The Lord\'s Prayer','The Apostles\' Creed','The Shepherd\'s Prayer'], fact:'Matthew 6:9-13 — "Our Father, who art in heaven, hallowed be thy name…"' },
  { section:'Ministry', q:'Whom did Jesus call "the rock" on which he would build his church?', a:'Peter', choices:['John','James','Peter','Andrew'], fact:'Matthew 16:18 — "Thou art Peter, and upon this rock I will build my church".' },
  { section:'Ministry', q:'Which religious group repeatedly opposed Jesus over questions of the Law?', a:'The Pharisees', choices:['The Sadducees','The Pharisees','The Zealots','The Essenes'], fact:'The Pharisees emphasised strict observance of oral and written Law and clashed with Jesus often (e.g. Matthew 12, 23).' },
  { section:'Ministry', q:'On which mountain was Jesus transfigured before Peter, James and John?', a:'Tradition calls it Mount Tabor', choices:['Mount Sinai','Mount Carmel','Tradition calls it Mount Tabor','Mount of Olives'], fact:'Matthew 17 — Jesus\'s face shone like the sun and Moses and Elijah appeared with him. The Gospels do not name the mountain.' },
  { section:'Ministry', q:'Which two figures appeared with Jesus at the Transfiguration?', a:'Moses and Elijah', choices:['Abraham and David','Moses and Elijah','John the Baptist and Elijah','Adam and Noah'], fact:'They represent the Law and the Prophets bearing witness to Jesus (Matthew 17:3).' },
  { section:'Ministry', q:'How many men did Jesus send out two-by-two to preach in nearby towns?', a:'Seventy', choices:['Twelve','Forty','Seventy','One hundred'], fact:'Luke 10 — they returned with joy reporting that even the demons submitted to them in his name.' },
  { section:'Ministry', q:'Which Samaritan did Jesus speak to at Jacob\'s well?', a:'A woman drawing water', choices:['A leper','A woman drawing water','A blind beggar','A Roman centurion'], fact:'John 4 — he asked her for a drink and offered her "living water"; she became one of the first to declare him the Messiah.' },
  { section:'Ministry', q:'Which two sisters in Bethany were close friends of Jesus?', a:'Mary and Martha', choices:['Mary and Martha','Rachel and Leah','Mary and Elizabeth','Naomi and Ruth'], fact:'Luke 10 & John 11 — Martha bustled while Mary sat at Jesus\'s feet; their brother Lazarus was raised from the dead.' },

  // ── Parables ─────────────────────────────────────────
  { section:'Parable', q:'In the parable of the Good Samaritan, who helped the wounded man on the road?', a:'A Samaritan traveller', choices:['A priest','A Levite','A Samaritan traveller','A Roman soldier'], fact:'Luke 10:25-37 — both a priest and a Levite passed by; only the despised Samaritan stopped to help.' },
  { section:'Parable', q:'In the parable of the Prodigal Son, what did the father do when his lost son returned?', a:'Ran to embrace him and threw a feast', choices:['Refused to see him','Ran to embrace him and threw a feast','Made him a hired servant','Sent him away again'], fact:'Luke 15 — the father saw him a long way off and ran to him, then called for the fattened calf to be killed for a celebration.' },
  { section:'Parable', q:'In the parable of the sower, what fell among thorns?', a:'Some of the seed', choices:['Some of the seed','A bundle of wheat','Stones from a sling','A net of fish'], fact:'Matthew 13 — the seed among thorns is choked by the cares of the world and the deceitfulness of riches.' },
  { section:'Parable', q:'In the parable of the lost sheep, how many sheep did the shepherd leave to seek the one?', a:'Ninety-nine', choices:['Nine','Ninety-nine','Forty-nine','One hundred'], fact:'Luke 15:1-7 — Jesus said heaven rejoices more over one sinner who repents than over ninety-nine righteous.' },
  { section:'Parable', q:'In the parable of the talents, how many were given to the wicked servant who buried his?', a:'One', choices:['One','Two','Five','Ten'], fact:'Matthew 25 — the servant with one talent buried it in the ground; his master called him wicked and lazy.' },
  { section:'Parable', q:'What did the man find in a field that he sold all to obtain?', a:'A treasure', choices:['A pearl','A treasure','A vineyard','A herd of sheep'], fact:'Matthew 13:44 — "the kingdom of heaven is like treasure hidden in a field" — and the merchant\'s pearl of great price (13:45-46) makes the same point.' },
  { section:'Parable', q:'In the parable of the ten virgins, what distinguished the wise from the foolish?', a:'The wise brought extra oil for their lamps', choices:['The wise brought extra oil for their lamps','The wise wore white robes','The wise sang louder','The wise prayed more'], fact:'Matthew 25:1-13 — when the bridegroom was delayed, only the wise had oil to keep their lamps burning to greet him.' },
  { section:'Parable', q:'In the parable of the Good Shepherd, who lays down his life for the sheep?', a:'The shepherd', choices:['The hired hand','The shepherd','The wolf','The sheepdog'], fact:'John 10 — "I am the good shepherd: the good shepherd giveth his life for the sheep".' },
  { section:'Parable', q:'In the parable of the unmerciful servant, what was forgiven before the servant refused to forgive others?', a:'A great debt', choices:['A small debt','A great debt','A grain offering','A criminal sentence'], fact:'Matthew 18:21-35 — the king forgave him 10,000 talents; he then refused to forgive a fellow servant a mere 100 denarii.' },
  { section:'Parable', q:'In the parable of the rich fool, what did he plan to build to store his abundance?', a:'Bigger barns', choices:['A bigger house','Bigger barns','A vineyard','A stone tower'], fact:'Luke 12 — God called him a fool because his life was demanded that very night, before he could enjoy his riches.' },

  // ── Miracles ─────────────────────────────────────────
  { section:'Miracle', q:'At what wedding did Jesus turn water into wine?', a:'A wedding at Cana', choices:['A wedding at Cana','A wedding at Capernaum','A wedding at Bethany','A wedding at Nazareth'], fact:'John 2 — his first miracle; the steward of the feast marvelled that the host had saved the best wine for last.' },
  { section:'Miracle', q:'How many loaves and fish did Jesus use to feed the 5,000?', a:'Five loaves and two fish', choices:['Two loaves and five fish','Five loaves and two fish','Seven loaves and a few small fish','Twelve loaves and twelve fish'], fact:'Matthew 14, John 6 — twelve baskets of leftovers were collected after everyone ate.' },
  { section:'Miracle', q:'On what did Jesus walk during a storm to reach his disciples in the boat?', a:'Water', choices:['Air','Water','Clouds','A wooden plank'], fact:'Matthew 14 — Peter began to walk on water toward him but began to sink when his faith wavered.' },
  { section:'Miracle', q:'Whom did Jesus raise from the dead after he had been four days in the tomb?', a:'Lazarus', choices:['Jairus\'s daughter','The widow\'s son at Nain','Lazarus','Tabitha'], fact:'John 11 — "Lazarus, come forth!" — and the dead man came out, his hands and feet wrapped with grave clothes.' },
  { section:'Miracle', q:'Whom did Jesus heal when ten lepers cried out for mercy?', a:'All ten — but only one returned to thank him', choices:['Only one','Three of them','Seven of them','All ten — but only one returned to thank him'], fact:'Luke 17:11-19 — the one who returned was a Samaritan; Jesus said his faith had made him well.' },
  { section:'Miracle', q:'How did Jesus calm a storm on the Sea of Galilee?', a:'He rebuked the wind and the sea', choices:['He prayed to the Father','He rebuked the wind and the sea','He sent his disciples to row harder','He commanded the boat to fly'], fact:'Mark 4:39 — "Peace, be still!" — the wind ceased and there was a great calm.' },
  { section:'Miracle', q:'What did Jesus put on the eyes of a blind man before sending him to wash in the pool of Siloam?', a:'Mud made with saliva', choices:['Olive oil','Mud made with saliva','Water from a well','Wine and honey'], fact:'John 9 — the man washed and came back seeing; the religious leaders were enraged that this was done on the Sabbath.' },
  { section:'Miracle', q:'Through what did four men lower a paralyzed man so Jesus could heal him?', a:'A hole in the roof', choices:['A window','A hole in the roof','The front door','A trapdoor in the floor'], fact:'Mark 2:1-12 — Jesus first forgave his sins, then told him to take up his mat and walk.' },
  { section:'Miracle', q:'How many years had the woman with the bleeding suffered before being healed by touching Jesus\'s cloak?', a:'Twelve', choices:['Three','Seven','Twelve','Forty'], fact:'Mark 5 — Jesus felt power go out from him; he told her, "Daughter, your faith has healed you".' },
  { section:'Miracle', q:'Whose daughter, age twelve, did Jesus raise saying "Talitha cumi"?', a:'Jairus', choices:['Jairus','Zacchaeus','Nicodemus','Caiaphas'], fact:'Mark 5 — "Talitha cumi" means "Little girl, arise". The synagogue ruler\'s daughter rose immediately.' },
];

function pickQuestion() {
  if (bsPool === null) bsPool = shuffle(TRIVIA);
  if (bsPool.length === 0) return null;
  return bsPool.pop();
}

function showComplete() {
  document.getElementById('bs-section').textContent = 'Quiz complete';
  document.getElementById('bs-question').textContent = `🎉 You answered ${bsScore} out of ${bsQ} correctly!`;
  document.getElementById('bs-feedback').textContent = '';
  document.getElementById('bs-feedback').className = 'bs-feedback';
  document.getElementById('bs-fact-box').style.display = 'none';

  const grid = document.getElementById('bs-options');
  grid.innerHTML = '';
  const btn = document.createElement('button');
  btn.className = 'bs-btn correct';
  btn.textContent = '🔄 Start Over';
  btn.onclick = restartBS;
  grid.appendChild(btn);
}

function restartBS() {
  bsScore = 0;
  bsQ     = 0;
  bsPool  = null;
  renderQ();
}

function renderQ() {
  const q = pickQuestion();
  if (!q) { showComplete(); return; }

  bsQ++;
  document.getElementById('bs-score').textContent = bsScore;
  document.getElementById('bs-qnum').textContent  = bsQ;
  document.getElementById('bs-feedback').textContent = '';
  document.getElementById('bs-feedback').className   = 'bs-feedback';
  document.getElementById('bs-fact-box').style.display = 'none';

  document.getElementById('bs-section').textContent = q.section;
  document.getElementById('bs-question').textContent = q.q;

  const grid = document.getElementById('bs-options');
  grid.innerHTML = '';
  shuffle(q.choices).forEach(opt => {
    const btn = document.createElement('button');
    btn.className   = 'bs-btn';
    btn.textContent = opt;
    btn.onclick = () => handleAnswer(opt, btn, q.a, q.fact);
    grid.appendChild(btn);
  });
}

function handleAnswer(chosen, btn, correct, fact) {
  document.querySelectorAll('.bs-btn').forEach(b => b.onclick = null);
  const fb = document.getElementById('bs-feedback');

  if (chosen === correct) {
    btn.classList.add('correct');
    fb.textContent = '✅ Correct!';
    fb.className   = 'bs-feedback good';
    bsScore++;
    document.getElementById('bs-score').textContent = bsScore;
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.bs-btn').forEach(b => {
      if (b.textContent === correct) b.classList.add('correct');
    });
    fb.textContent = '❌ Not quite';
    fb.className   = 'bs-feedback bad';
  }

  document.getElementById('bs-fact-text').textContent = fact;
  document.getElementById('bs-fact-box').style.display = 'block';

  setTimeout(renderQ, 9000);
}

document.addEventListener('DOMContentLoaded', () => {
  bsScore = 0;
  bsQ     = 0;
  bsPool  = null;
  renderQ();
});
