import { deepEqual, equal } from "assert";
import { it } from "mocha";
import { fetchFromWeb, extractCharacterData } from "./scraper";

let transformCharacterDocument;
let transformCharacterData;
let multiTransformEZACharacterDocument;
let multiTransformEZACharacterData;
let EZAActiveCharacterDocument;
let EZAActiveCharacterData;
let standardCharacterDocument;
let standardCharacterData;
let transformEZALRCharacterDocument;
let transformEZALRCharacterData;
let separateDetailsBoxDocument;
let separateDetailsBoxData;

before(async function () {
  this.timeout(10000);
  transformCharacterDocument = await fetchFromWeb('https://dbz-dokkanbattle.fandom.com/wiki/Divine_Warriors_with_Infinite_Power_Super_Saiyan_God_Goku_%26_Super_Saiyan_God_Vegeta')
  transformCharacterData = extractCharacterData(transformCharacterDocument);

  multiTransformEZACharacterDocument = await fetchFromWeb('https://dbz-dokkanbattle.fandom.com/wiki/Boiling_Power_Super_Saiyan_Goku#Super_Saiyan')
  multiTransformEZACharacterData = extractCharacterData(multiTransformEZACharacterDocument);

  EZAActiveCharacterDocument = await fetchFromWeb('https://dbz-dokkanbattle.fandom.com/wiki/Wings_Spread_Out_to_the_Cosmos_Pan_(GT)_(Honey)')
  EZAActiveCharacterData = extractCharacterData(EZAActiveCharacterDocument);

  standardCharacterDocument = await fetchFromWeb('https://dbz-dokkanbattle.fandom.com/wiki/A_Promise_Made_to_Kakarot_Super_Saiyan_2_Vegeta_(Angel)')
  standardCharacterData = extractCharacterData(standardCharacterDocument);

  transformEZALRCharacterDocument = await fetchFromWeb('https://dbz-dokkanbattle.fandom.com/wiki/Fused_Fighting_Force_Super_Saiyan_Goku_(Angel)_%26_Super_Saiyan_Vegeta_(Angel)')
  transformEZALRCharacterData = extractCharacterData(transformEZALRCharacterDocument);

  separateDetailsBoxDocument = await fetchFromWeb('https://dbz-dokkanbattle.fandom.com/wiki/Ally_of_Love_and_Friendship_Videl')
  separateDetailsBoxData = extractCharacterData(separateDetailsBoxDocument);
})


describe("Name Extraction", function () {
  it("should be able to extract the name - multitransform", () => {
    equal(multiTransformEZACharacterData.name, "Super Saiyan Goku");
  });

  it("should be able to extract the name - transform", () => {
    equal(transformCharacterData.name, "Super Saiyan God Goku & Super Saiyan God Vegeta");
  });

  it("should be able to extract the name - EZA", () => {
    equal(EZAActiveCharacterData.name, "Pan (GT) (Honey)");
  });

  it("should be able to extract the name - standard", () => {
    equal(standardCharacterData.name, "Super Saiyan 2 Vegeta (Angel)");
  });
});

describe("Title Extraction", function () {
  it("should be able to extract the title - multitransform", () => {
    equal(multiTransformEZACharacterData.title, "Boiling Power");
  });

  it("should be able to extract the title - transform", () => {
    equal(transformCharacterData.title, "Divine Warriors with Infinite Power");
  });

  it("should be able to extract the title - EZA", () => {
    equal(EZAActiveCharacterData.title, "Wings Spread Out to the Cosmos");
  });

  it("should be able to extract the title - standard", () => {
    equal(standardCharacterData.title, "A Promise Made to Kakarot");
  });
});

describe("Max Level Extraction", function () {
  it("should be able to extract the Max Level - multitransform", () => {
    equal(multiTransformEZACharacterData.maxLevel, "140");
  });

  it("should be able to extract the Max Level - transform", () => {
    equal(transformCharacterData.maxLevel, "150");
  });

  it("should be able to extract the Max Level - EZA", () => {
    equal(EZAActiveCharacterData.maxLevel, "150");
  });

  it("should be able to extract the Max Level - standard", () => {
    equal(standardCharacterData.maxLevel, "150");
  });
});

describe("Max SA Level Extraction", function () {
  it("should be able to extract the Max SA Level - multitransform", () => {
    equal(multiTransformEZACharacterData.maxSALevel, "15");
  });

  it("should be able to extract the Max SA Level - transform", () => {
    equal(transformCharacterData.maxSALevel, "25");
  });

  it("should be able to extract the Max SA Level - EZA", () => {
    equal(EZAActiveCharacterData.maxSALevel, "25");
  });

  it("should be able to extract the Max SA Level - standard", () => {
    equal(standardCharacterData.maxSALevel, "25");
  });
});

describe("Rarity Extraction", function () {
  it("should be able to extract the Rarity - multitransform", () => {
    equal(multiTransformEZACharacterData.rarity, "UR");
  });

  it("should be able to extract the Rarity - transform", () => {
    equal(transformCharacterData.rarity, "LR");
  });

  it("should be able to extract the Rarity - EZA", () => {
    equal(EZAActiveCharacterData.rarity, "LR");
  });

  it("should be able to extract the Rarity - standard", () => {
    equal(standardCharacterData.rarity, "LR");
  });
});

describe("Class Extraction", function () {
  it("should be able to extract the Class - multitransform", () => {
    equal(multiTransformEZACharacterData.class, "Super");
  });

  it("should be able to extract the Class - transform", () => {
    equal(transformCharacterData.class, "Super");
  });

  it("should be able to extract the Class - EZA", () => {
    equal(EZAActiveCharacterData.class, "Super");
  });

  it("should be able to extract the Class - standard", () => {
    equal(standardCharacterData.class, "Super");
  });
});

describe("Type Extraction", function () {
  it("should be able to extract the Type - multitransform", () => {
    equal(multiTransformEZACharacterData.type, "AGL");
  });

  it("should be able to extract the Type - transform", () => {
    equal(transformCharacterData.type, "TEQ");
  });

  it("should be able to extract the Type - EZA", () => {
    equal(EZAActiveCharacterData.type, "STR");
  });

  it("should be able to extract the Type - standard", () => {
    equal(standardCharacterData.type, "PHY");
  });
});

describe("Cost Extraction", function () {
  it("should be able to extract the Cost - multitransform", () => {
    equal(multiTransformEZACharacterData.cost, "58");
  });

  it("should be able to extract the Cost - transform", () => {
    equal(transformCharacterData.cost, "77");
  });

  it("should be able to extract the Cost - EZA", () => {
    equal(EZAActiveCharacterData.cost, "59");
  });

  it("should be able to extract the Cost - standard", () => {
    equal(standardCharacterData.cost, "77");
  });
});

describe("ID Extraction", function () {
  it("should be able to extract the ID - multitransform", () => {
    equal(multiTransformEZACharacterData.id, "11476");
  });

  it("should be able to extract the ID - transform", () => {
    equal(transformCharacterData.id, "12238");
  });

  it("should be able to extract the ID - EZA", () => {
    equal(EZAActiveCharacterData.id, "11591");
  });

  it("should be able to extract the ID - standard", () => {
    equal(standardCharacterData.id, "12022");
  });
});

describe("ImageURL Extraction", function () {
  it("should be able to extract the ImageURL - multitransform", () => {
    equal(multiTransformEZACharacterData.imageURL, "/wiki/Category:Super_Class");
  });

  it("should be able to extract the transformedImageURL - multitransform", () => {
    equal(multiTransformEZACharacterData.transformations[0].transformedImageURL, undefined);
    equal(multiTransformEZACharacterData.transformations[1].transformedImageURL, undefined);
    equal(multiTransformEZACharacterData.transformations[2].transformedImageURL, undefined);
    equal(multiTransformEZACharacterData.transformations[3].transformedImageURL, undefined);
  });

  it("should be able to extract the ImageURL - transform", () => {
    equal(transformCharacterData.imageURL, "https://static.wikia.nocookie.net/dbz-dokkanbattle/images/7/75/Card_1022380_thumb_apng.png/revision/latest?cb=20220130071219&format=original");
  });

  it("should be able to extract the transformedImageURL - transform", () => {
    equal(transformCharacterData.transformations[0].transformedImageURL, "https://static.wikia.nocookie.net/dbz-dokkanbattle/images/b/b4/Card_4022390_thumb_apng.png/revision/latest?cb=20220130071254&format=original");
  });

  it("should be able to extract the ImageURL - EZA", () => {
    equal(EZAActiveCharacterData.imageURL, "https://vignette.wikia.nocookie.net/dbz-dokkanbattle/images/3/35/Card_1015910_thumb_apng.png/revision/latest?cb=20190128070309&format=original");
  });

  it("should be able to extract the ImageURL - standard", () => {
    equal(standardCharacterData.imageURL, "https://vignette.wikia.nocookie.net/dbz-dokkanbattle/images/a/a1/Card_1020220_thumb_apng.png/revision/latest?cb=20200916113202&format=original");
  });
});

describe("LeaderSkill Extraction", function () {
  it("should be able to extract the LeaderSkill - multitransform", () => {
    equal(multiTransformEZACharacterData.leaderSkill, "Super Class Ki +3 and HP, ATK & DEF +120%");
  });

  it("should be able to extract the LeaderSkill - transform", () => {
    equal(transformCharacterData.leaderSkill, '"Power Beyond Super Saiyan" or "Movie Heroes" Category Ki +3 and HP, ATK & DEF +170%;plus an additional HP, ATK & DEF +30% for characters who also belong to the "Kamehameha" Category');
  });

  it("should be able to extract the LeaderSkill - EZA", () => {
    equal(EZAActiveCharacterData.leaderSkill, "Recovers 3333 HP per Ki Sphere of character's Type obtained");
  });

  it("should be able to extract the LeaderSkill - standard", () => {
    equal(standardCharacterData.leaderSkill, '"Worthy Rivals" Category Ki +4 and HP, ATK & DEF +150%;or Type Ki +4 and HP, ATK & DEF +100%');
  });
});

describe("EZALeaderSkill Extraction", function () {
  it("should be able to extract the EZALeaderSkill - multitransform", () => {
    equal(multiTransformEZACharacterData.ezaLeaderSkill, "Super Class Ki +3 and HP, ATK & DEF +130%");
  });

  it("should be able to extract the EZALeaderSkill - transform", () => {
    equal(transformCharacterData.ezaLeaderSkill, '"Power Beyond Super Saiyan" or "Movie Heroes" Category Ki +3 and HP, ATK & DEF +170%;plus an additional Ki +1 and HP, ATK & DEF +30% for characters who also belong to the "Kamehameha" Category');
  });

  it("should be able to extract the EZALeaderSkill - EZA", () => {
    equal(EZAActiveCharacterData.ezaLeaderSkill, "Recovers 5555 HP per Ki Sphere of character's Type obtained");
  });

  it("should be able to extract the EZALeaderSkill - standard", () => {
    equal(standardCharacterData.ezaLeaderSkill, '"Worthy Rivals" Category Ki +4 and HP, ATK & DEF +170%;or Type Ki +4 and HP, ATK & DEF +100%');
  });
});

describe("SuperAttack Extraction", function () {
  it("should be able to extract the SuperAttack - multitransform", () => {
    equal(multiTransformEZACharacterData.superAttack, "Raises ATK & DEF[1] and causes immense damage to enemy");
  });

  it("should be able to extract the SuperAttack - transform", () => {
    equal(transformCharacterData.superAttack, 'Raises ATK & DEF[1] and causes colossal damage to enemy');
  });

  it("should be able to extract the SuperAttack - EZA", () => {
    equal(EZAActiveCharacterData.superAttack, "Causes colossal damage with a chance of stunning the enemy[1]");
  });

  it("should be able to extract the SuperAttack - standard", () => {
    equal(standardCharacterData.superAttack, 'Raises DEF for 1 turn[1] and causes colossal damage to enemy');
  });
});

describe("EZASuperAttack Extraction", function () {
  it("should be able to extract the EZASuperAttack - multitransform", () => {
    equal(multiTransformEZACharacterData.ezaSuperAttack, "Raises ATK & DEF[1], causes immense damage to enemy and lowers DEF[2]");
  });

  it("should be able to extract the EZASuperAttack - transform", () => {
    equal(transformCharacterData.ezaSuperAttack, 'Greatly raises ATK & DEF[2] and causes colossal damage to enemy');
  });

  it("should be able to extract the EZASuperAttack - EZA", () => {
    equal(EZAActiveCharacterData.ezaSuperAttack, "Causes colossal damage with a medium chance of stunning the enemy[2]");
  });

  it("should be able to extract the EZASuperAttack - standard", () => {
    equal(standardCharacterData.ezaSuperAttack, 'Greatly raises DEF for 1 turn[2] and causes colossal damage to enemy');
  });
});

describe("UltraSuperAttack Extraction", function () {
  it("should be able to extract the UltraSuperAttack - multitransform", () => {
    equal(multiTransformEZACharacterData.ultraSuperAttack, undefined);
  });

  it("should be able to extract the UltraSuperAttack - transform", () => {
    equal(transformCharacterData.ultraSuperAttack, 'Raises ATK & DEF[1] and causes mega-colossal damage to enemy');
  });

  it("should be able to extract the UltraSuperAttack - EZA", () => {
    equal(EZAActiveCharacterData.ultraSuperAttack, "Causes colossal damage with a medium chance of stunning the enemy[2]");
  });

  it("should be able to extract the UltraSuperAttack - standard", () => {
    equal(standardCharacterData.ultraSuperAttack, 'Causes mega-colossal damage to enemy and greatly lowers DEF[3]');
  });
});

describe("EZAUltraSuperAttack Extraction", function () {
  it("should be able to extract the EZAUltraSuperAttack - multitransform", () => {
    equal(multiTransformEZACharacterData.ezaUltraSuperAttack, undefined);
  });

  it("should be able to extract the EZAUltraSuperAttack - transform", () => {
    equal(transformCharacterData.ezaUltraSuperAttack, 'Greatly raises ATK & DEF[2] and causes mega-colossal damage to enemy');
  });

  it("should be able to extract the EZAUltraSuperAttack - EZA", () => {
    equal(EZAActiveCharacterData.ezaUltraSuperAttack, "Greatly raises ATK for 1 turn[3] and causes colossal damage with a medium chance of stunning the enemy[2]");
  });

  it("should be able to extract the EZAUltraSuperAttack - standard", () => {
    equal(standardCharacterData.ezaUltraSuperAttack, 'Raises ATK & DEF for 1 turn[4], causes mega-colossal damage to enemy and greatly lowers DEF[5]');
  });
});

describe("Passive Extraction", function () {
  it("should be able to extract the Passive - multitransform", () => {
    equal(multiTransformEZACharacterData.passive, 'ATK & DEF 80% Damage reduction rate 21%');
  });

  it("should be able to extract the Passive - transform", () => {
    equal(transformCharacterData.passive, "Activates the Entrance Animation upon the character's entry; Guards all attacks for 1 turn Receives an additional Ki +1 per Type Ki Sphere obtained and ATK & DEF 77% for 7 turn(s); ATK & DEF 120% Receives an additional Ki +1 per Type Ki Sphere obtained; For every Ki Sphere obtained Chance of performing a critical hit 7%; When attacking with 20 or more Ki Launches an additional Super Attack; When attacking with 24 Ki Attacks are effective against all Types")
  });

  it("should be able to extract the Passive - EZA", () => {
    equal(EZAActiveCharacterData.passive, "Recovers 33% of damage dealt as HP; When receiving an attack High chance[4] of damage reduction rate 55% within the turn");
  });

  it("should be able to extract the Passive - standard", () => {
    equal(standardCharacterData.passive, 'ATK & DEF 70%; For every Ki when attacking ATK & DEF 4% (up to 70%); When the name of an ally who is attacking in the same turn or an enemy includes "Goku" (Youth, Captain Ginyu, Jr., etc. excluded) Ki +3; When there is a "Majin Buu Saga" Category ally whose name includes "Goku" attacking in the same turns Ki +3');
  });
});

describe("EZAPassive Extraction", function () {
  it("should be able to extract the EZAPassive - multitransform", () => {
    equal(multiTransformEZACharacterData.ezaPassive, 'ATK & DEF 110% Damage reduction rate 21%When attacking Extreme Class enemies Ki +3 ATK 10% DEF 40%');
  });

  it("should be able to extract the EZAPassive - transform", () => {
    equal(transformCharacterData.ezaPassive, "Activates the Entrance Animation upon the character's entry Damage reduction rate 77% and launches an additional Super Attack for 1 turn Ki +2, ATK & DEF 100% and guards all attacks for 7 turns; ATK & DEF 200% Receives an additional Ki +2 per Type Ki Sphere obtained; For every Ki Sphere obtained ATK & DEF 10% (up to 77%); For every Ki Sphere obtained Chance of performing a critical hit 10%; When attacking with 17 or more Ki Launches an additional Super Attack; When attacking with 20 or more Ki Attacks effective against all Types Launches an additional Super Attack")
  });

  it("should be able to extract the EZAPassive - EZA", () => {
    equal(EZAActiveCharacterData.ezaPassive, "High chance[5] of Ki +3 High chance[6] of Ki +3 Recovers 33% of damage dealt as HP Damage reduction rate 55%");
  });

  it("should be able to extract the EZAPassive - standard", () => {
    equal(standardCharacterData.ezaPassive, `Ki +2 and ATK & DEF 200%; For 5 turn(s) from the character's entry turn Ki +2 and ATK 100%; For every Ki when attacking ATK & DEF 10% (up to 180%); When attacking with 18 or more Ki Guards all attacks Launches an additional Super Attack; When all allies attacking in the same turn have obtained a Ki Sphere All allies' DEF 10% (self excluded) per Ki obtained by the character himself (count starts from the 18th Ki); When the name of an ally who is attacking in the same turn or an enemy includes "Goku" (Youth, Captain Ginyu, Jr., etc. excluded) Ki +4 and ATK & DEF 59%; When there is a "Majin Buu Saga" Category ally whose name includes "Goku" attacking in the same turns Ki +4 and ATK & DEF 59%`);
  });
});

describe("ActiveSkill Extraction", function () {
  it("should be able to extract the ActiveSkill - multitransform", () => {
    equal(multiTransformEZACharacterData.activeSkill, undefined);
  });

  it("should be able to extract the ActiveSkill - transform", () => {
    equal(transformCharacterData.activeSkill, 'Transforms; Can be activated starting from the 4th turn from the start of battle (once only)')
  });

  it("should be able to extract the ActiveSkill - EZA", () => {
    equal(EZAActiveCharacterData.activeSkill, "All allies' ATK +33% for 1 turn");
  });

  it("should be able to extract the ActiveSkill - standard", () => {
    equal(standardCharacterData.activeSkill, 'Ki +1, ATK +59% and DEF +78% for 1 turn');
  });
});

describe("ActiveSkillCondition Extraction", function () {
  it("should be able to extract the ActiveSkillCondition - multitransform", () => {
    equal(multiTransformEZACharacterData.activeSkillCondition, undefined);
  });

  it("should be able to extract the ActiveSkillCondition - transform", () => {
    equal(transformCharacterData.activeSkillCondition, undefined)
  });

  it("should be able to extract the ActiveSkillCondition - EZA", () => {
    equal(EZAActiveCharacterData.activeSkillCondition, "Can be activated starting from the 3rd turn from start of battle (once only)");
  });

  it("should be able to extract the ActiveSkillCondition - standard", () => {
    equal(standardCharacterData.activeSkillCondition, 'Can be activated when there is a "Majin Buu Saga" Category ally whose name includes "Goku" attacking in the same turn, starting from the 3rd turn from the start of battle (once only)');
  });
});

describe("EZAActiveSkill Extraction", function () {
  it("should be able to extract the EZAActiveSkill - multitransform", () => {
    equal(multiTransformEZACharacterData.ezaActiveSkill, undefined);
  });

  it("should be able to extract the EZAActiveSkill - transform", () => {
    equal(transformCharacterData.ezaActiveSkill, undefined)
  });

  it("should be able to extract the EZAActiveSkill - EZA", () => {
    equal(EZAActiveCharacterData.ezaActiveSkill, "All allies' ATK +33% for 1 turn");
  });

  it("should be able to extract the EZAActiveSkill - standard", () => {
    equal(standardCharacterData.ezaActiveSkill, 'Ki +1, ATK +59% and DEF +78% for 1 turn');
  });
});


describe("EZAActiveSkillCondition Extraction", function () {
  it("should be able to extract the EZAActiveSkillCondition - multitransform", () => {
    equal(multiTransformEZACharacterData.ezaActiveSkillCondition, undefined);
  });

  it("should be able to extract the EZAActiveSkillCondition - transform", () => {
    equal(transformCharacterData.ezaActiveSkillCondition, undefined)
  });

  it("should be able to extract the EZAActiveSkillCondition - EZA", () => {
    equal(EZAActiveCharacterData.ezaActiveSkillCondition, "Can be activated starting from the 3rd turn from start of battle (once only)");
  });

  it("should be able to extract the EZAActiveSkillCondition - standard", () => {
    equal(standardCharacterData.ezaActiveSkillCondition, 'Can be activated when there is a "Majin Buu Saga" Category ally whose name includes "Goku" attacking in the same turn, starting from the 3rd turn from the start of battle (once only)');
  });
});

describe("TransformationCondition Extraction", function () {
  it("should be able to extract the TransformationCondition - multitransform", () => {
    equal(multiTransformEZACharacterData.transformationCondition, "Transforms starting from the 3rd turn from the start of battle");
  });

  it("should be able to extract the TransformationCondition - transform", () => {
    equal(transformCharacterData.transformationCondition, "Transforms; Can be activated starting from the 4th turn from the start of battle (once only)")
  });

  it("should be able to extract the TransformationCondition - EZA", () => {
    equal(EZAActiveCharacterData.transformationCondition, undefined);
  });

  it("should be able to extract the TransformationCondition - standard", () => {
    equal(standardCharacterData.transformationCondition, undefined);
  });
});

describe("Links Extraction", function () {
  it("should be able to extract the Links - multitransform", () => {
    deepEqual(multiTransformEZACharacterData.links, ['All in the Family','Golden Warrior','Super Saiyan','Experienced Fighters','Kamehameha','Prepared for Battle','Fierce Battle']);
  });

  it("should be able to extract the Links - transform", () => {
    deepEqual(transformCharacterData.links, ['Super Saiyan','Kamehameha','Warrior Gods','Godly Power','Prepared for Battle','Fierce Battle','Legendary Power'])
  });

  it("should be able to extract the Links - EZA", () => {
    deepEqual(EZAActiveCharacterData.links, ['All in the Family','The Saiyan Lineage','Battlefield Diva','GT','The Innocents','Shattering the Limit','Legendary Power']);
  });

  it("should be able to extract the Links - standard", () => {
    deepEqual(standardCharacterData.links, ['Saiyan Warrior Race','Prodigies','Super Saiyan','Royal Lineage','Golden Warrior','Fierce Battle','Legendary Power']);
  });
});

describe("Categories Extraction", function () {
  it("should be able to extract the Categories - multitransform", () => {
    deepEqual(multiTransformEZACharacterData.categories, ['Realm of Gods','Super Saiyan 3','Pure Saiyans','Full Power','Transformation Boost',"Goku's Family",'Super Saiyans','Kamehameha','Super Saiyan 2','Turtle School','Mastered Evolution','Legendary Existence','Bond of Friendship','Accelerated Battle','Power Beyond Super Saiyan','Bond of Parent and Child', 'Earth-Bred Fighters']);
  });

  it("should be able to extract the Categories - transform", () => {
    deepEqual(transformCharacterData.categories, ['Fusion','Realm of Gods','Pure Saiyans','Transformation Boost','Joined Forces','Movie Heroes','Kamehameha','Final Trump Card','Time Limit','Mastered Evolution','Power Beyond Super Saiyan','Fused Fighters','Bond of Parent and Child', 'Super Heroes', 'Earth-Protecting Heroes'])
  });

  it("should be able to extract the Categories - EZA", () => {
    deepEqual(EZAActiveCharacterData.categories, ['Hybrid Saiyans','Dragon Ball Seekers',"Goku's Family",'Youth','Space-Traveling Warriors','GT Heroes','Bond of Friendship','Bond of Parent and Child','Earth-Bred Fighters']);
  });

  it("should be able to extract the Categories - standard", () => {
    deepEqual(standardCharacterData.categories, ['Resurrected Warriors','Majin Buu Saga','Pure Saiyans',"Vegeta's Family",'Worthy Rivals','Otherworld Warriors','Super Saiyan 2','All-Out Struggle','Connected Hope','Gifted Warriors','Time Limit','Mastered Evolution','Battle of Fate','Power Beyond Super Saiyan','Bond of Parent and Child','Successors']);
  });
});

describe("KiMeter Extraction", function () {
  it("should be able to extract the KiMeter - multitransform", () => {
    deepEqual(multiTransformEZACharacterData.kiMeter, ['Error']);
  });

  it("should be able to extract the KiMeter - transform", () => {
    deepEqual(transformCharacterData.kiMeter, ['Error'])
  });

  it("should be able to extract the KiMeter - EZA", () => {
    deepEqual(EZAActiveCharacterData.kiMeter, ['Error', 'Error']);
  });

  it("should be able to extract the KiMeter - standard", () => {
    deepEqual(standardCharacterData.kiMeter, ['Error']);
  });
});

describe("BaseHP Extraction", function () {
  it("should be able to extract the BaseHP - multitransform", () => {
    equal(multiTransformEZACharacterData.baseHP, '3213');
  });

  it("should be able to extract the BaseHP - transform", () => {
    equal(transformCharacterData.baseHP, '4992')
  });

  it("should be able to extract the BaseHP - EZA", () => {
    equal(EZAActiveCharacterData.baseHP, "5087");
  });

  it("should be able to extract the BaseHP - standard", () => {
    equal(standardCharacterData.baseHP, '5007');
  });
});

describe("MaxLevelHP Extraction", function () {
  it("should be able to extract the MaxLevelHP - multitransform", () => {
    equal(multiTransformEZACharacterData.maxLevelHP, '10605');
  });

  it("should be able to extract the MaxLevelHP - transform", () => {
    equal(transformCharacterData.maxLevelHP, '16475')
  });

  it("should be able to extract the MaxLevelHP - EZA", () => {
    equal(EZAActiveCharacterData.maxLevelHP, "16788");
  });

  it("should be able to extract the MaxLevelHP - standard", () => {
    equal(standardCharacterData.maxLevelHP, '16688');
  });
});

describe("FreeDupeHP Extraction", function () {
  it("should be able to extract the FreeDupeHP - multitransform", () => {
    equal(multiTransformEZACharacterData.freeDupeHP, '12605');
  });

  it("should be able to extract the FreeDupeHP - transform", () => {
    equal(transformCharacterData.freeDupeHP, '18475')
  });

  it("should be able to extract the FreeDupeHP - EZA", () => {
    equal(EZAActiveCharacterData.freeDupeHP, "17988");
  });

  it("should be able to extract the FreeDupeHP - standard", () => {
    equal(standardCharacterData.freeDupeHP, '18688');
  });
});

describe("RainbowHP Extraction", function () {
  it("should be able to extract the RainbowHP - multitransform", () => {
    equal(multiTransformEZACharacterData.rainbowHP, '15205');
  });

  it("should be able to extract the RainbowHP - transform", () => {
    equal(transformCharacterData.rainbowHP, '21075')
  });

  it("should be able to extract the RainbowHP - EZA", () => {
    equal(EZAActiveCharacterData.rainbowHP, "19788");
  });

  it("should be able to extract the RainbowHP - standard", () => {
    equal(standardCharacterData.rainbowHP, '22088');
  });
});

describe("BaseAttack Extraction", function () {
  it("should be able to extract the BaseAttack - multitransform", () => {
    equal(multiTransformEZACharacterData.baseAttack, '3629');
  });

  it("should be able to extract the BaseAttack - transform", () => {
    equal(transformCharacterData.baseAttack, '5053')
  });

  it("should be able to extract the BaseAttack - EZA", () => {
    equal(EZAActiveCharacterData.baseAttack, "3252");
  });

  it("should be able to extract the BaseAttack - standard", () => {
    equal(standardCharacterData.baseAttack, '4748');
  });
});

describe("MaxLevelAttack Extraction", function () {
  it("should be able to extract the MaxLevelAttack - multitransform", () => {
    equal(multiTransformEZACharacterData.maxLevelAttack, '11978');
  });

  it("should be able to extract the MaxLevelAttack - transform", () => {
    equal(transformCharacterData.maxLevelAttack, '16675')
  });

  it("should be able to extract the MaxLevelAttack - EZA", () => {
    equal(EZAActiveCharacterData.maxLevelAttack, "10734");
  });

  it("should be able to extract the MaxLevelAttack - standard", () => {
    equal(standardCharacterData.maxLevelAttack, '15825');
  });
});

describe("FreeDupeAttack Extraction", function () {
  it("should be able to extract the FreeDupeAttack - multitransform", () => {
    equal(multiTransformEZACharacterData.freeDupeAttack, '13978');
  });

  it("should be able to extract the FreeDupeAttack - transform", () => {
    equal(transformCharacterData.freeDupeAttack, '18675')
  });

  it("should be able to extract the FreeDupeAttack - EZA", () => {
    equal(EZAActiveCharacterData.freeDupeAttack, "11934");
  });

  it("should be able to extract the FreeDupeAttack - standard", () => {
    equal(standardCharacterData.freeDupeAttack, '17825');
  });
});

describe("RainbowAttack Extraction", function () {
  it("should be able to extract the RainbowAttack - multitransform", () => {
    equal(multiTransformEZACharacterData.rainbowAttack, '16978');
  });

  it("should be able to extract the RainbowAttack - transform", () => {
    equal(transformCharacterData.rainbowAttack, '22075')
  });

  it("should be able to extract the RainbowAttack - EZA", () => {
    equal(EZAActiveCharacterData.rainbowAttack, "13974");
  });

  it("should be able to extract the RainbowAttack - standard", () => {
    equal(standardCharacterData.rainbowAttack, '20825');
  });
});

describe("BaseDefence Extraction", function () {
  it("should be able to extract the BaseDefence - multitransform", () => {
    equal(multiTransformEZACharacterData.baseDefence, '1621');
  });

  it("should be able to extract the BaseDefence - transform", () => {
    equal(transformCharacterData.baseDefence, '2475')
  });

  it("should be able to extract the BaseDefence - EZA", () => {
    equal(EZAActiveCharacterData.baseDefence, "2496");
  });

  it("should be able to extract the BaseDefence - standard", () => {
    equal(standardCharacterData.baseDefence, '2674');
  });
});

describe("MaxDefence Extraction", function () {
  it("should be able to extract the MaxDefence - multitransform", () => {
    equal(multiTransformEZACharacterData.maxDefence, '5350');
  });

  it("should be able to extract the MaxDefence - transform", () => {
    equal(transformCharacterData.maxDefence, '8169')
  });

  it("should be able to extract the MaxDefence - EZA", () => {
    equal(EZAActiveCharacterData.maxDefence, "8239");
  });

  it("should be able to extract the MaxDefence - standard", () => {
    equal(standardCharacterData.maxDefence, '8913');
  });
});

describe("FreeDupeDefence Extraction", function () {
  it("should be able to extract the FreeDupeDefence - multitransform", () => {
    equal(multiTransformEZACharacterData.freeDupeDefence, '7350');
  });

  it("should be able to extract the FreeDupeDefence - transform", () => {
    equal(transformCharacterData.freeDupeDefence, '10169')
  });

  it("should be able to extract the FreeDupeDefence - EZA", () => {
    equal(EZAActiveCharacterData.freeDupeDefence, "9439");
  });

  it("should be able to extract the FreeDupeDefence - standard", () => {
    equal(standardCharacterData.freeDupeDefence, '10913');
  });
});

describe("RainbowDefence Extraction", function () {
  it("should be able to extract the RainbowDefence - multitransform", () => {
    equal(multiTransformEZACharacterData.rainbowDefence, '10750');
  });

  it("should be able to extract the RainbowDefence - transform", () => {
    equal(transformCharacterData.rainbowDefence, '13169')
  });

  it("should be able to extract the RainbowDefence - EZA", () => {
    equal(EZAActiveCharacterData.rainbowDefence, "10999");
  });

  it("should be able to extract the RainbowDefence - standard", () => {
    equal(standardCharacterData.rainbowDefence, '13513');
  });
});

describe("KiMultiplier Extraction", function () {
  it("should be able to extract the KiMultiplier - multitransform", () => {
    equal(multiTransformEZACharacterData.kiMultiplier, '12 Ki Multiplier is 150%; ');
  });

  it("should be able to extract the KiMultiplier - transform", () => {
    equal(transformCharacterData.kiMultiplier, '12 Ki Multiplier is 160%; 24 Ki Multiplier is 200%; SA Lv.20 raises SA Multiplier by an additional 30%')
  });

  it("should be able to extract the KiMultiplier - EZA", () => {
    equal(EZAActiveCharacterData.kiMultiplier, "12 Ki Multiplier is 140%; 24 Ki Multiplier is 200%; SA Lv.20 raises SA Multiplier by an additional 30%");
  });

  it("should be able to extract the KiMultiplier - standard", () => {
    equal(standardCharacterData.kiMultiplier, '12 Ki Multiplier is 150%; 24 Ki Multiplier is 200%; SA Lv.20 raises SA Multiplier by an additional 30%');
  });

  it("should be able to extract the KiMultiplier - separate details box", () => {
    equal(separateDetailsBoxData.kiMultiplier, '12 Ki Multiplier is 150%');
  });
});

describe("Tranformations Extraction", function () {
  it("should be able to extract the Transformation - multitransform", () => {
    equal(multiTransformEZACharacterData.transformations.length, 4);
  });

  it("should be able to extract the Transformations - transform", () => {
    equal(transformCharacterData.transformations.length, 1)
  });

  it("should be able to extract the Transformations - EZA", () => {
    equal(EZAActiveCharacterData.transformations.length, 0);
  });

  it("should be able to extract the Transformations - standard", () => {
    equal(standardCharacterData.transformations.length, 0);
  });
});

describe("Tranformation Names Extraction", function () {
  it("should be able to extract the Transformation Names - multitransform", () => {
    equal(multiTransformEZACharacterData.transformations[0].transformedName, 'Super Saiyan 2 Goku');
    equal(multiTransformEZACharacterData.transformations[1].transformedName, 'Super Saiyan 3 Goku');
    equal(multiTransformEZACharacterData.transformations[2].transformedName, 'Super Saiyan God Goku');
    equal(multiTransformEZACharacterData.transformations[3].transformedName, 'Super Saiyan God SS Goku');
  });

  it("should be able to extract the Transformations Names - transform", () => {
    equal(transformCharacterData.transformations[0].transformedName, 'Super Saiyan God SS Goku & Super Saiyan God SS Vegeta')
  });
});

describe("Tranformation TransformedID Extraction", function () {
  it("should be able to extract the Transformation TransformedID - multitransform", () => {
    equal(multiTransformEZACharacterData.transformations[0].transformedID, '41477');
    equal(multiTransformEZACharacterData.transformations[1].transformedID, '41478');
    equal(multiTransformEZACharacterData.transformations[2].transformedID, '41479');
    equal(multiTransformEZACharacterData.transformations[3].transformedID, '41480');
  });

  it("should be able to extract the Transformations TransformedID - transform", () => {
    equal(transformCharacterData.transformations[0].transformedID, '42239')
  });
});

describe("Tranformation TransformedClass Extraction", function () {
  it("should be able to extract the Transformation TransformedClass - multitransform", () => {
    equal(multiTransformEZACharacterData.transformations[0].transformedClass, 'Super');
    equal(multiTransformEZACharacterData.transformations[1].transformedClass, 'Super');
    equal(multiTransformEZACharacterData.transformations[2].transformedClass, 'Super');
    equal(multiTransformEZACharacterData.transformations[3].transformedClass, 'Super');
  });

  it("should be able to extract the Transformations TransformedClass - transform", () => {
    equal(transformCharacterData.transformations[0].transformedClass, 'Super')
  });
});

describe("Tranformation TransformedType Extraction", function () {
  it("should be able to extract the Transformation TransformedType - multitransform", () => {
    equal(multiTransformEZACharacterData.transformations[0].transformedType, 'AGL');
    equal(multiTransformEZACharacterData.transformations[1].transformedType, 'AGL');
    equal(multiTransformEZACharacterData.transformations[2].transformedType, 'AGL');
    equal(multiTransformEZACharacterData.transformations[3].transformedType, 'AGL');
  });

  it("should be able to extract the Transformations TransformedType - transform", () => {
    equal(transformCharacterData.transformations[0].transformedType, 'TEQ')
  });
});

describe("Tranformation TransformedSuperAttack Extraction", function () {
  it("should be able to extract the Transformation TransformedSuperAttack - multitransform", () => {
    equal(multiTransformEZACharacterData.transformations[0].transformedSuperAttack, 'Raises ATK & DEF[1] and causes immense damage to enemy');
    equal(multiTransformEZACharacterData.transformations[1].transformedSuperAttack, 'Raises ATK & DEF[1] and causes immense damage to enemy');
    equal(multiTransformEZACharacterData.transformations[2].transformedSuperAttack, 'Raises ATK & DEF[1] and causes immense damage to enemy');
    equal(multiTransformEZACharacterData.transformations[3].transformedSuperAttack, 'Causes immense damage with a great chance to stun the enemy[1]');
  });

  it("should be able to extract the Transformations TransformedSuperAttack - transform", () => {
    equal(transformCharacterData.transformations[0].transformedSuperAttack, 'Greatly raises ATK & DEF for 1 turn[1] and causes colossal damage to enemy')
  });
});

describe("Tranformation TransformedEZASuperAttack Extraction", function () {
  it("should be able to extract the Transformation TransformedEZASuperAttack - multitransform", () => {
    equal(multiTransformEZACharacterData.transformations[0].transformedEZASuperAttack, 'Raises ATK & DEF[1], causes immense damage to enemy and lowers DEF[2]');
    equal(multiTransformEZACharacterData.transformations[1].transformedEZASuperAttack, 'Raises ATK & DEF[1], causes immense damage to enemy and lowers DEF[2]');
    equal(multiTransformEZACharacterData.transformations[2].transformedEZASuperAttack, 'Raises ATK & DEF[1], causes immense damage to enemy and lowers DEF[2]');
    equal(multiTransformEZACharacterData.transformations[3].transformedEZASuperAttack, 'Raises ATK & DEF for 1 turn[2] and causes immense damage with a great chance of stunning the enemy[1]');
  });

  it("should be able to extract the Transformations TransformedEZASuperAttack - transform", () => {
    equal(transformCharacterData.transformations[0].transformedEZASuperAttack, 'Massively raises ATK and greatly raises DEF for 1 turn[2] and causes colossal damage to enemy')
  });
});

describe("Tranformation TransformedUltraSuperAttack Extraction", function () {
  it("should be able to extract the Transformation TransformedUltraSuperAttack - multitransform", () => {
    equal(multiTransformEZACharacterData.transformations[0].transformedUltraSuperAttack, undefined);
    equal(multiTransformEZACharacterData.transformations[1].transformedUltraSuperAttack, undefined);
    equal(multiTransformEZACharacterData.transformations[2].transformedUltraSuperAttack, undefined);
    equal(multiTransformEZACharacterData.transformations[3].transformedUltraSuperAttack, undefined);
  });

  it("should be able to extract the Transformations TransformedUltraSuperAttack - transform", () => {
    equal(transformCharacterData.transformations[0].transformedUltraSuperAttack, "Massively raises ATK & DEF for 1 turn[3] and causes mega-colossal damage to enemy; disables enemy's action once within the turn")
  });
});

describe("Tranformation TransformedUltraSuperAttack Extraction", function () {
  it("should be able to extract the Transformation TransformedUltraSuperAttack - multitransform", () => {
    equal(multiTransformEZACharacterData.transformations[0].transformedUltraSuperAttack, undefined);
    equal(multiTransformEZACharacterData.transformations[1].transformedUltraSuperAttack, undefined);
    equal(multiTransformEZACharacterData.transformations[2].transformedUltraSuperAttack, undefined);
    equal(multiTransformEZACharacterData.transformations[3].transformedUltraSuperAttack, undefined);
  });

  it("should be able to extract the Transformations TransformedUltraSuperAttack - transform", () => {
    equal(transformCharacterData.transformations[0].transformedUltraSuperAttack, "Massively raises ATK & DEF for 1 turn[3] and causes mega-colossal damage to enemy; disables enemy's action once within the turn")
  });
});

describe("Tranformation TransformedEZAUltraSuperAttack Extraction", function () {
  it("should be able to extract the Transformations TransformedEZAUltraSuperAttack - transform", () => {
    equal(transformCharacterData.transformations[0].transformedEZAUltraSuperAttack, "Massively raises ATK & DEF for 4 turns[4] and causes mega-colossal damage to enemy; disables enemy's action once within the turn")
  });
  it("should be able to extract the Transformations TransformedEZAUltraSuperAttack - transform", () => {
    equal(transformEZALRCharacterData.transformations[0].transformedEZAUltraSuperAttack, "Greatly raises DEF for 1 turn[3], causes mega-colossal damage to enemy and greatly lowers ATK & DEF[4]")
  });
});

describe("Tranformation TransformedPassive Extraction", function () {
  it("should be able to extract the Transformation TransformedPassive - multitransform", () => {
    equal(multiTransformEZACharacterData.transformations[0].transformedPassive, "ATK 90% DEF 60% Damage reduction rate 22%");
    equal(multiTransformEZACharacterData.transformations[1].transformedPassive, "ATK 100% DEF 40% Damage reduction rate 23%");
    equal(multiTransformEZACharacterData.transformations[2].transformedPassive, "ATK 110% DEF 20% Damage reduction rate 24%");
    equal(multiTransformEZACharacterData.transformations[3].transformedPassive, "ATK 120% Damage reduction rate 25% Ki +12 Performs a critical hit");
  });

  it("should be able to extract the Transformations TransformedPassive - transform", () => {
    equal(transformCharacterData.transformations[0].transformedPassive, "ATK & DEF 177% Receives an additional Ki +2 per Type Ki Sphere obtained Medium chance[5] of performing a critical hit Medium chance[6] of evading enemy's attack (including Super Attack); For every Ki Sphere obtained Chance of performing a critical hit 7% Chance of evading enemy's attack (including Super Attack) 7%; When attacking with 16 or more Ki Attacks effective against all types; When attacking with 20 or more Ki Launches an additional Super Attack")
  });
});

describe("Tranformation TransformedEZAPassive Extraction", function () {
  it("should be able to extract the Transformation TransformedEZAPassive - multitransform", () => {
    equal(multiTransformEZACharacterData.transformations[0].transformedEZAPassive, "ATK & DEF 120% Damage reduction rate 22%When attacking Extreme Class enemies Ki +3 ATK 20% DEF 30%");
    equal(multiTransformEZACharacterData.transformations[1].transformedEZAPassive, "ATK & DEF 130% Damage reduction rate 23%When attacking Extreme Class Enemies Ki +3 ATK 30% DEF 20%");
    equal(multiTransformEZACharacterData.transformations[2].transformedEZAPassive, "ATK & DEF 140% Damage reduction rate 24%When attacking Extreme Class enemies Ki +3 ATK 40% DEF 10%");
    equal(multiTransformEZACharacterData.transformations[3].transformedEZAPassive, "ATK & DEF 150% Damage reduction rate 25% Ki +12 Performs a critical hitWhen attacking Extreme Class enemies Ki +3 ATK 50%");
  });

  it("should be able to extract the Transformations TransformedEZAPassive - transform", () => {
    equal(transformCharacterData.transformations[0].transformedEZAPassive, "Damage reduction rate 77% for 1 turn ATK & DEF 300% Receives an additional Ki +2 per Ki Sphere obtained Attacks are effective against all Types Guards all attacks High chance[7] of performing a critical hit Medium chance[8] of evading enemy's attack Change Ki Spheres: to; For 4 turns from the character's entry turn Randomly changes Ki Spheres of a certain Type ( excluded) to Ki Spheres; For every Ki Sphere obtained ATK & DEF 10% (up to 100%); For every Ki Sphere obtained Chance of performing a critical hit & evading enemy's attack 10%; 7 or more Ki Spheres obtained Launches an additional Super Attack; When attacking with 20 or more Ki Launches an additional Super Attack; When activating the Active Skill or when attacking with 24 Ki ATK 50%; When attacking Performs a critical hit and launches an additional Super Attack when the enemy's HP is 50% or moreWhen receiving an attack Evades enemy's attack when HP is 50% or less")
  });
});

describe("Tranformation TransformedActiveSkill Extraction", function () {
  it("should be able to extract the Transformation TransformedActiveSkill - multitransform", () => {
    equal(multiTransformEZACharacterData.transformations[0].transformedActiveSkill, undefined);
    equal(multiTransformEZACharacterData.transformations[1].transformedActiveSkill, undefined);
    equal(multiTransformEZACharacterData.transformations[2].transformedActiveSkill, undefined);
    equal(multiTransformEZACharacterData.transformations[3].transformedActiveSkill, undefined);
  });

  it("should be able to extract the Transformations TransformedActiveSkill - transform", () => {
    equal(transformCharacterData.transformations[0].transformedActiveSkill, "Causes ultimate damage to enemy and, within the turn activated, all attacks become critical hits")
  });
});

describe("Tranformation TransformedActiveSkillCondition Extraction", function () {
  it("should be able to extract the Transformation TransformedActiveSkillCondition - multitransform", () => {
    equal(multiTransformEZACharacterData.transformations[0].transformedActiveSkillCondition, undefined);
    equal(multiTransformEZACharacterData.transformations[1].transformedActiveSkillCondition, undefined);
    equal(multiTransformEZACharacterData.transformations[2].transformedActiveSkillCondition, undefined);
    equal(multiTransformEZACharacterData.transformations[3].transformedActiveSkillCondition, undefined);
  });

  it("should be able to extract the Transformations TransformedActiveSkillCondition - transform", () => {
    equal(transformCharacterData.transformations[0].transformedActiveSkillCondition, "Can be activated when HP is 50% or less or when facing only 1 enemy, whose HP is 50% or less (once only)")
  });
});

// TODO: Transformed EZA Active Skill + Condition. Can't think of an example.


describe("Tranformation TransformedLinks Extraction", function () {
  it("should be able to extract the Transformation TransformedLinks - multitransform", () => {
    deepEqual(multiTransformEZACharacterData.transformations[0].transformedLinks, ['All in the Family','Golden Warrior','Super Saiyan','Experienced Fighters','Kamehameha','Prepared for Battle','Fierce Battle']);
    deepEqual(multiTransformEZACharacterData.transformations[1].transformedLinks, ['Limit-Breaking Form','Golden Warrior','Super Saiyan','Experienced Fighters','Kamehameha','Over in a Flash','Fierce Battle']);
    deepEqual(multiTransformEZACharacterData.transformations[2].transformedLinks, ['Godly Power','Warrior Gods','Super Saiyan','Shocking Speed','All in the Family','Over in a Flash','Fierce Battle']);
    deepEqual(multiTransformEZACharacterData.transformations[3].transformedLinks, ['Godly Power', 'Warrior Gods','Super Saiyan', 'Shocking Speed', 'All in the Family', 'Over in a Flash', 'Fierce Battle']);
  });

  it("should be able to extract the Transformations TransformedLinks - transform", () => {
    deepEqual(transformCharacterData.transformations[0].transformedLinks, ['Super Saiyan','Kamehameha','Warrior Gods','Godly Power','Prepared for Battle','Fierce Battle','Legendary Power'])
  });
});

describe("Tranformation TransformedLinks Extraction", function () {
  it("should be able to extract the Transformation TransformedLinks - multitransform", () => {
    deepEqual(multiTransformEZACharacterData.transformations[0].transformedLinks, ['All in the Family','Golden Warrior','Super Saiyan','Experienced Fighters','Kamehameha','Prepared for Battle','Fierce Battle']);
    deepEqual(multiTransformEZACharacterData.transformations[1].transformedLinks, ['Limit-Breaking Form','Golden Warrior','Super Saiyan','Experienced Fighters','Kamehameha','Over in a Flash','Fierce Battle']);
    deepEqual(multiTransformEZACharacterData.transformations[2].transformedLinks, ['Godly Power','Warrior Gods','Super Saiyan','Shocking Speed','All in the Family','Over in a Flash','Fierce Battle']);
    deepEqual(multiTransformEZACharacterData.transformations[3].transformedLinks, ['Godly Power', 'Warrior Gods','Super Saiyan', 'Shocking Speed', 'All in the Family', 'Over in a Flash', 'Fierce Battle']);
  });

  it("should be able to extract the Transformations TransformedLinks - transform", () => {
    deepEqual(transformCharacterData.transformations[0].transformedLinks, ['Super Saiyan','Kamehameha','Warrior Gods','Godly Power','Prepared for Battle','Fierce Battle','Legendary Power'])
  });
});