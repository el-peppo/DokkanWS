# Dragon Ball Dokkan Battle Complete Mechanics Guide

## Core Game Foundation

Dragon Ball Dokkan Battle is a puzzle RPG where players collect Ki orbs on a 7x7 grid to power character attacks. The game combines turn-based strategy with puzzle mechanics, featuring complex stat calculations and dynamic character transformations.

### Ki System Mechanics

The Ki system drives all combat interactions. Players select connected orbs of the same color to build Ki chains, with longer chains providing more Ki energy.

**Ki Collection Rules:**
- Same-color orbs: 2 Ki per orb
- Off-color orbs: 1 Ki per orb  
- Rainbow orbs: 1 Ki per orb (connect to any color but maintain single chains)
- Minimum Ki: 0, Maximum standard: 12, LR maximum: 24

**Ki Thresholds:**
- 0-11 Ki: Damage penalties from 50% to 95%
- 12 Ki: Super Attack threshold, 100% damage
- 13+ Ki: Bonus damage scaling
- 24 Ki: LR exclusive, fixed 200% multiplier

**LR Ki Formula:**
```
Final Ki Multiplier = [[200 - 12 Ki mult] / 12 * (current Ki - 12)] + 12 Ki mult
```

### Type System

Five primary types form a circular advantage system: AGL beats STR beats PHY beats INT beats TEQ beats AGL.

**Damage Modifiers:**
- Type advantage: 1.5x damage dealt, 0.5x damage received
- Type disadvantage: 0.5x damage dealt, 1.5x damage received  
- Neutral: 1.0x both directions
- Rainbow/Universal type: Always neutral

**Character Classifications:**
- Super Class: Heroes and good characters
- Extreme Class: Villains and evil characters
- Combined with type for full classification (Super AGL, Extreme INT, etc.)

### Rarity and Awakening Progression

**Rarity Levels:**
- N (Normal): Base fodder, ~1,000 max stats
- R (Rare): Training material, ~2,000 max stats
- SR (Super Rare): Early game units, ~4,000 max stats
- SSR (Super Super Rare): Standard rare pulls, ~7,000 max stats
- UR (Ultra Rare): Z-Awakened SSRs, ~12,000 max stats
- TUR (Transcended UR): Dokkan Awakened, ~15,000 max stats
- LR (Legendary Rare): Highest tier, ~20,000+ max stats

**Level Caps:**
- UR: Level 100
- TUR: Level 120  
- EZA: Level 140
- LR: Level 150

### Team Structure

Teams consist of 7 characters total: 6 owned plus 1 friend/guest. The leader position provides a Leader Skill affecting the entire team.

**Rotation System:**
- Battle uses 3-character turns
- Positions 1-2 return after 2 turns (main rotation)
- Position 3 returns after 3 turns (floating)
- Fixed pattern: (1,2,3) → (4,5,6) → (7,1,2) → (3,4,5) → repeat

**Team Cost:**
- Historical limitation removed in Update 5.0.2
- Character costs still displayed: N(4), R(8), SR(12), SSR(16), UR(20), TUR(48), LR(58-99)

## Character Enhancement Systems

### Z-Awakening

Standard awakening progression using colored medals:

**Medal Requirements:**
- R→SR: 3 small medals
- SR→SSR: 5 medium medals  
- SSR→UR: 7 large medals
- Medal colors match character types

**Dokkan Awakening:**
- Character-specific transformation
- Requires medals from Dokkan Events
- Changes character art, name, and abilities
- Reversible with Incredible Hourglass items

### Extreme Z-Awakening (EZA)

Advanced enhancement system for older characters:

**Requirements & Eligibility:**
- Player Rank 50+
- Character must be UR or higher (typically TURs)
- Character must be at maximum level (usually 120)
- Super Attack Level 10 recommended (not required)
- Hidden Potential investment recommended

**Event Structure:**
- Stages 1-30: Medal collection phase
- Stage 30: EZA awakening unlocked
- Stages 31-77: Optional, provides 1.5M Zeni per clear
- Stages 78+: Prestige levels, extremely difficult with no rewards

**Medal Requirements:**
- Bronze: 12 medals
- Silver: 20 medals
- Gold: 12 medals  
- Rainbow: 12 medals
- Total: 77 medals

**EZA Stat Formula:**
```
Level 140 stat = (Level 120 stat - Level 1 stat) × 0.4839 + Level 120 stat
Level 135 stat = (Level 120 stat - Level 1 stat) × 0.3629 + Level 120 stat
Level 130 stat = (Level 120 stat - Level 1 stat) × 0.2419 + Level 120 stat
Level 125 stat = (Level 120 stat - Level 1 stat) × 0.1209 + Level 120 stat
```

**Skill Enhancements:**
- Leader Skill: Higher percentage boosts (+20-30%)
- Passive Skill: Significantly improved effects (often doubled)
- Super Attack: Level cap increased from 10 to 15
- Super Attack Multipliers Increase:
  - Immense: 505% → 630%
  - Supreme: 430% → 530%
  - Extreme: 330% → 430%
  - Huge: 280% → 380%

**EZA Types:**
- Standard EZA: Dokkan Festival units, regular banner units
- EZArea: Story event characters, F2P units
- Sub-EZA: Non-Dokkan Festival units using medals from main EZA events

### Super Extreme Z-Awakening (SEZA)

Additional enhancement beyond EZA:

**Requirements:**
- Complete EZA (Level 140)
- Clear SUPER difficulty level
- No continues or items allowed
- Specific team restrictions
- One-time clear needed

**SEZA Properties:**
- Enhances Passive Skills only
- No level increase (stays at 140)
- No stat changes
- SA level cap remains at 15

**Passive Enhancement Patterns:**
- Additional ATK/DEF boosts (+30-50%)
- New mechanics (guaranteed additional attacks, crits)
- Reduced restrictions on conditions
- Team support capabilities added

### Hidden Potential System

Character customization through orb investment:

**Requirements:**
- Player Rank 50+
- UR rarity or higher
- Duplicate copies for path unlocking

**Four Paths:**
- Top Left: Balanced, free Level 5 skill
- Top Right: ATK focus, requires SA 2
- Bottom Left: HP/DEF focus, requires SA 5  
- Bottom Right: Maximum growth, requires SA 10

**Star Abilities:**
- Critical Hit: 2% per level, max 20 levels (40% chance)
- Additional Attack: 2% per level, max 20 levels (40% chance, 50% chance for SA)
- Dodge: 1% per level, max 20 levels (20% chance, 25% for INT)
- SA Boost: 5% per level, max 15 levels (+75% to SA multiplier)

**Orb Investment (100% completion):**
- Small orbs: ~4,320
- Medium orbs: ~2,480
- Large orbs: ~225
- Stat boost: ~+7,000 each stat

### Super Attack Leveling

**Level Ranges:**
- Standard: SA 1-10
- EZA: SA 1-15
- LR: SA 1-20

**Training Methods:**
- Elder Kai: 100% success, works on all characters
- Same name: Success rate varies by rarity matching
- Type Kai: 100% for matching type
- Sleepy Kai: 30% universal success

**SA Multipliers at Max Level:**
- Huge: 280%
- Extreme: 330%
- Supreme: 430%
- Immense: 505%
- Colossal: 540%
- Ultimate: 550%
- Mega-Colossal: 570%

### Link Skills

Adjacent character bonuses that level through battle:

**Link Mechanics:**
- Activate ONLY between characters in positions 1-2 or 2-3
- Characters with same name cannot link together
- Level 1-10 progression
- Random chance to level after each battle
- Maximum 4 links can level per character per battle

**Leveling Rates:**
- Higher stamina events = better rates
- Level 9→10 approximately 3% chance
- Link Level 10 provides ~50% stronger effects than Level 1
- Decimal values are truncated (known bug)

## Advanced Character Mechanics

### Rage Mode

Temporary invincibility state triggered by specific conditions:

**Rage Mode Properties:**
- 1 turn complete damage immunity
- Cannot take any damage from any source
- Character can still attack normally
- Visual indicator shows character in rage state
- One-time activation per battle

**Rage Activation Conditions:**
- Specific HP threshold when receiving fatal damage
- Must be on active rotation when triggered
- Some characters have guaranteed rage activation
- Others have percentage chances

**Rage Mode vs Revival:**
- Rage: Prevents death for 1 turn, no HP recovery
- Revival: Character actually dies and resurrests with HP

### Giant Form Mechanics

Complete transformation that breaks normal battle rules:

**Giant Form Properties:**
- 1-3 turn duration (character-specific)
- Complete damage immunity (cannot take damage)
- Occupies all three attack positions simultaneously
- Type advantage against ALL enemy types
- Fixed damage values instead of calculated damage
- All Link Skills deactivate while in Giant Form
- Category Leader Skills still apply

**Giant Form Activation:**
- Random chance per turn (typically 10-20%)
- Some require HP thresholds
- Others activate via Active Skills
- Cannot be forced or guaranteed

**Giant Form Leaders:**
- Some characters increase Giant Form activation rates
- Can increase maximum transformations per battle
- Provide additional Giant Form bonuses

### Transformation System

Character form changes with various trigger mechanisms:

**Transformation Categories:**

**Turn-Based Transformations:**
- "Starting from the 4th turn"
- "Starting from the 6th turn"
- Automatic activation when conditions met
- Cannot be prevented or delayed

**HP-Based Transformations:**
- "When HP is 58% or below"
- "When HP is 50% or below"
- Checked at start of each turn
- Permanent once activated

**Conditional Transformations:**
- "When facing 1 enemy"
- "When there is a Super Class ally on the team"
- "When performing a Super Attack"
- Must maintain conditions to transform

**Multi-Condition Transformations:**
- Combine multiple requirements with AND logic
- "Starting from turn 4 AND when HP is 50% or below"
- All conditions must be met simultaneously

**Transformation States:**
- Permanent: Lasts entire battle once activated
- Temporary: Reverts after specified turns
- Progressive: Multiple transformation stages

**Transformation Effects:**
- Complete stat recalculation
- New passive skills
- Different Super Attack animations
- Changed Link Skills
- New character artwork and name

### Fusion Mechanics

Character combination system creating new unified entities:

**Fusion Process:**
- Two separate characters combine via Active Skill
- Original characters permanently replaced
- New fused character has independent stats
- Full HP recovery upon fusion
- One-time activation per battle

**Fusion Requirements:**
- Typically "Starting from turn 3-5"
- Usually "When HP is 50% or below"
- Both characters must be present
- Some require specific positioning

**Fusion Types:**

**Potara Fusion:**
- Permanent fusion via Potara earrings
- Typically no time limit in-game
- Massive stat multipliers (150-200% base stats)
- Complete moveset overhaul

**Fusion Dance:**
- Temporary fusion with dance technique
- Some have time limits
- Perfect synchronization requirements
- Specific character pairings only

**Post-Fusion Properties:**
- New Leader Skill
- New Passive Skill
- New Link Skills
- New Super Attack
- Independent Hidden Potential paths

### Standby Skills

Temporary character removal for enhanced return attacks:

**Standby Types:**

**Charge Type Standby:**
- Character accumulates Ki while absent
- Damage scales with Ki collected
- Two different attack animations based on Ki amount
- Examples: PHY LR SSJ3 Goku & SSJ2 Vegeta

**Fixed Type Standby:**
- Predetermined attack power regardless of duration
- Single attack animation
- Fixed effects and damage
- Examples: STR Kid Goku, TEQ Goku

**Standby Mechanics:**
- Character leaves rotation temporarily
- Pre-standby passive effects persist one additional turn
- Return timing varies by character (2-4 turns typical)
- Cannot be cancelled or interrupted
- Other characters continue normal rotation

**Standby Integration:**
- Can combine with transformation mechanics
- Some characters transform upon return
- May activate revival mechanics
- Can trigger fusion sequences

### Active Skills

Player-controlled special abilities with manual activation:

**Active Skill Categories:**

**Ultimate Attacks:**
- 550% damage multiplier (calculated as 24 Ki attack)
- Massive screen-filling animations
- Can hit multiple enemies
- One-time use per battle
- Examples: LR Gohan's Father-Son Kamehameha

**Transformation Active Skills:**
- Player chooses when to transform
- Alternative to automatic transformations
- Permanent or temporary changes
- Strategic timing importance
- Examples: AGL Gogeta Blue transformation

**Exchange Active Skills:**
- Switch between different characters
- Each form has independent abilities
- Can be one-way or reversible
- Position in rotation matters
- Examples: TEQ Gohan/Piccolo exchange

**Support Active Skills:**
- Team-wide healing effects
- ATK/DEF buffs for all allies
- Ki restoration
- Temporary invincibility
- Examples: Various healing actives

**Utility Active Skills:**
- Guaranteed critical hits
- Additional attacks
- DEF bypassing
- Type effectiveness changes
- Examples: Guaranteed crit actives

**Activation Conditions:**
- Turn count requirements (most common)
- HP threshold conditions
- Team composition requirements
- Enemy type/number conditions
- Battle phase restrictions

**Active Skill Timing:**
- Must be activated during character's turn
- Cannot be used if character not on rotation
- Some have limited activation windows
- Strategic timing affects battle outcome

**Active Skill Restrictions:**
- One use per battle (most common)
- Some allow multiple uses
- Cannot be saved between battles
- Specific event restrictions may apply

### Exchange Characters

Characters with switching mechanics through Active Skills:

**Traditional Exchange:**
- One-way character swap via Active Skill
- Completely different stats and abilities
- Permanent switch once activated
- Examples: TEQ Gohan → Piccolo

**Reversible Exchange:**
- Switch back and forth between characters
- Independent stat calculations for each form
- Flexible team building strategies
- Examples: LR Goku & Vegeta (Angel) reversible exchange

**Timed Exchange:**
- Last 3 turns before auto-reverting
- Buffs and debuffs carry over between exchanges

### Revival Mechanics

Auto-resurrection system that activates when KO conditions are met:

**Revival Conditions:**
- HP below 50% at turn start
- Specific attack counters
- Must be on active rotation when KO occurs
- One use per battle per character
- Character must actually reach 0 HP to activate

**Revival Effects:**
- Restores ~70% HP upon revival
- Character gains enhanced abilities post-revival
- Visual transformation often occurs
- May unlock new Active Skills or transformations
- Visual indicator: Heart icon with aura (grey after use)

**Revival vs Rage Mode:**
- Revival: Character dies and comes back with HP
- Rage: Character becomes invincible for 1 turn without dying

### Counter Attack Mechanics

Automatic retaliation system for certain characters:

**Counter Mechanics:**
- Activates automatically (100% guarantee) when character is attacked
- Cannot counter super attacks (only normal attacks)
- Counter damage typically ranges from 200-400% of attack stat
- Can activate multiple times per turn if hit multiple times

**Counter Types:**
- Normal Counters: Standard damage calculation
- Super Counters: Use Super Attack animation and multiplier
- Conditional Counters: Only against certain attack types

**Counter Positioning:**
- Character can counter from any position when attacked
- Counters cannot be dodged or blocked
- Counters can critical hit if character has crit chance

### Support Skills

Passive abilities that buff teammates when on the same rotation:

**Support Mechanics:**
- Affect all allies on rotation, not just adjacent units
- Apply before Ki collection phase
- Stack with other support effects additively
- Calculated multiplicatively after Link Skills but before Super Attack boosts

**Common Support Effects:**
- ATK/DEF percentage boosts (typically 25-40%)
- Ki boosts (+1 to +3 Ki)
- Conditional effects based on character types or categories
- Turn-based or permanent duration

**Support Categories:**
- Universal: Affects all allies
- Type-specific: Only affects certain types (Super/Extreme)
- Category-specific: Only affects category members
- Character-specific: Affects specific named characters

## Damage Calculation System

### Complete ATK Formula

```
Final ATK = Base ATK × Leader Skills × (1 + All Percentage Boosts) × Ki Multiplier × (1 + When Attacking Boosts) × SA Multiplier × Type/Crit Multiplier
```

### Calculation Order

1. Leader Skills (multiplicative)
2. Passive Skills (start of turn effects)  
3. Support Items and Battlefield Memories
4. Link Skills (additive within same category)
5. Active Skill ATK boosts
6. Ki Multiplier (only calculation that rounds UP)
7. Passive Skills (when attacking effects)
8. Super Attack multiplier
9. Type advantage and critical hit multipliers

**Support Skill Integration:**
- Applied after passive skills but before link skills
- Multiple supports stack additively with each other
- Calculated multiplicatively in the damage formula
- Ki boosts apply before Ki multiplier calculation

### Critical Hit System

- Probability: 2% per level, max 20 levels (40% chance)
- Damage: 1.9x multiplier
- Bypasses enemy DEF completely
- Overrides type disadvantage

### Additional Attack System

- Probability: 2% per level, max 20 levels (40% chance)
- 50% chance to become a Super Attack
- Uses same ATK calculation as main attack
- Can activate multiple times per turn

### Ki Multiplier Scaling

Standard characters scale from their 12 Ki multiplier down to ~50% at 0 Ki.

**LR Ki Scaling:**
- 12 Ki: Character-specific multiplier (130-160%)
- 18 Ki: Mid-point scaling
- 24 Ki: Fixed 200% multiplier

**Rounding Rules:**
- All calculations round down except Ki Multiplier (rounds up)

## Game Modes and Events

### Story Mode

Board game style progression with branching paths:

- 1 Dragon Stone per first clear
- Various difficulty levels
- Character training materials
- Support item farming

### Dokkan Events

Character-specific medal farming events:

**Difficulty Tiers:**
- Normal: 10 stamina, basic medals
- Hard: 15 stamina, improved drops
- Z-Hard: 25 stamina, best medal rates
- Super: 40+ stamina, guaranteed medals

**Event Structure:**
- Multiple phases per battle
- Boss transformations common
- Type effectiveness varies by phase

### EZA Events

Enhancement events for specific characters:

**Event Progression:**
- Levels 1-30: Medal farming
- Levels 31-140: Zeni farming (1.5M per clear)
- No continues or support items allowed
- Boss weakness to specific categories/types

**EZA Resource Requirements:**
- 30 million Zeni per character
- 77 specific medals

### Battle Road Variants

**Super Battle Road (SBR):**
- Category/type restricted teams
- 4 support items allowed
- Multiple enemy waves
- Extreme difficulty

**Extreme Super Battle Road (ESBR):**
- Enhanced version of SBR
- Higher stats and damage
- Additional restrictions

### Fighting Legend Events

Long endurance battles testing team sustainability:

**Event Characteristics:**
- 7-8+ battle phases
- Boss gains stats each phase
- No healing items in later phases
- Specific character type advantages

**Variants:**
- Fighting Legend: Goku
- Fighting Legend: Vegeta  
- Fighting Legend: GT Goku
- Fighting Legend: Frieza

### Ultimate Red Zone

Endgame difficulty content:

**Restrictions:**
- 1 support item maximum
- Massive boss damage reduction
- Type nullification common
- Phase-specific gimmicks

### Virtual Clash (Battlefield)

Large-scale battle mode:

**Requirements:**
- 112+ UR characters minimum
- No duplicate characters on field
- Multiple boss stages
- Monthly reset cycle

**Rewards:**
- Battlefield Memories currency
- Team cost increases
- Exclusive characters

### World Tournament

Competitive ranking mode:

**Tournament Structure:**
- Pseudo-PvP against AI teams
- Point accumulation system
- Local and global rankings
- Tier-based rewards

**Scoring:**
- Points based on team difficulty
- Bonus characters increase points
- Consecutive wins provide multipliers

## Summoning and Currency Systems

### Dragon Stone Economy

Primary premium currency with multiple sources:

**Monthly F2P Income (~220 stones):**
- Daily login bonuses: 30-50 stones
- New events and missions: 50-100 stones
- Campaign rewards: 50-100 stones
- Celebration bonuses: Variable

### Banner Types and Rates

**Dokkan Festival Banners:**
- 5% featured SSR rate
- 10% total SSR rate
- Featured unit pool rotation
- Red coin currency (1 coin per 5 stones)

**Legendary Summon Banners:**
- 5% featured LR rate
- 10% total SSR rate
- LR-focused character pool
- Yellow/Gold coin currency

**Type Banners:**
- Type-specific character focus
- Higher rates for featured LRs
- Blue coin currency
- Rotating availability

### Guaranteed Features

**Guaranteed SSR (GSSR):**
- 10th position in all multi-summons
- Minimum SSR guaranteed per multi

**Discount Patterns:**
- 3+1 Free: Every 4th multi free
- Step-up: 5-step progression with bonuses
- GFSSR: Guaranteed featured in final step

### Coin Exchange System

Alternative character acquisition:

**Coin Values:**
- Red coins: Dokkan Festival characters
- Yellow coins: Legendary Summon LRs
- Blue coins: Type banner characters

**Exchange Costs:**
- DFE LRs: 500 red coins
- DFE TURs: 400 red coins  
- Legendary LRs: 500 yellow coins
- 500 coins = 2,500 Dragon Stones spent

## Technical Systems and Quality of Life

### Battle System

**Speed Options:**
- 1x normal speed
- 2x increased speed
- Skip options for Active Skills, entrances, revivals

**Animation Control:**
- Super Attack animations unskippable
- Active Skill animations skippable
- Entrance animations skippable after first viewing

### Friend System

**Friend Mechanics:**
- Friends provide 100 Friend Points per use
- Guests provide 50 Friend Points per use
- Manual friend list management required
- No search or filter functionality

### Item and Inventory Management

**Support Items:**
- Battle consumables with event restrictions
- Storage expandable with Dragon Stones
- Usage limits: 0-4 items depending on event

**Training Items:**
- Character experience enhancement
- Type-specific multipliers
- Stackable effects

### Stamina System

**Stamina Mechanics:**
- 1 stamina regeneration per 5 minutes
- Rank up provides full stamina recovery
- Dragon Stone for immediate full refill
- Overflow possible but stops natural regeneration

**Stamina Costs:**
- Story events: 8-25 stamina
- Dokkan events: 25-50 stamina
- EZA events: 0 stamina
- Special events: Variable

## Latest Updates and Future Features

### Recent Quality of Life Improvements

**Update 5.25.0 Features:**
- Passive Skill formatting enhancements
- Action count display improvements
- Enhanced visual clarity

**Training System Updates:**
- Max Growth training button
- Batch processing for multiple characters
- Auto-select optimal training materials

### 9th Anniversary Enhancements

**New Features:**
- Super Bosses category introduction
- 200% Leader Skills standardization
- Enhanced transformation mechanics
- UI/UX visual improvements

### Performance Optimizations

**Battle Improvements:**
- Reduced loading times
- Memory usage optimization
- Stability enhancements

**Event Efficiency:**
- Quick retry functionality
- Auto-mode for farming events
- Batch processing for EZA stages

### Future Development

The game continues to evolve with:

**Batch EZAs:**
- Multiple related units receiving EZA simultaneously
- Shared medal requirements
- Themed around specific sagas or events

**EZA Celebrations:**
- Dual Dokkan Festival EZAs
- Anniversary special EZAs
- Download celebration mega-EZAs

**Future Directions:**
- LR EZAs becoming more common
- Category leader EZAs beginning to appear
- SEZA expansion to more unit types
- Potential Level 150 cap with new awakening tier

**Critical Implementation Notes:**
1. Calculation order matters: Support boosts are multiplicative, not additive
2. Type effectiveness follows STR>PHY>INT>TEQ>AGL>STR wheel
3. Hidden mechanics: Link level decimals truncate, some nullification Active Skills have known bugs
4. Position rotation: Slots 1-2 return every 2 turns, slot 3 returns every 3 turns

This comprehensive guide covers all mechanics, formulas, and systems needed to accurately implement Dragon Ball Dokkan Battle's complex gameplay in a web application.