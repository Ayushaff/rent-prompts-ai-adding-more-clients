// import { MongoClient } from "mongodb";

// export async function migrateRapps() {
//   const uri = 'mongodb+srv://0701cs201014:YEo65XKmfynihBFH@cluster0.aqin6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/test'; // Replace with your MongoDB URI
//   const client = new MongoClient(uri);

//   try {
//     await client.connect();
//     const database = client.db('test'); // Replace with your database name
//     const rappsCollection = database.collection('rapps');

//     // Fetch all rapps
//     const rapps = await rappsCollection.find({}).toArray();

//     console.log("Rapps: " + rapps.length);

//     // Loop through each rapp and apply updates
//     for (const rapp of rapps) {
//       const updateOperations = {};

//       // Initialize $set and $unset if they don't exist
//       if (!updateOperations.$set) updateOperations.$set = {};
//       if (!updateOperations.$unset) updateOperations.$unset = {};

//       // Rename `type` to `modelType`
//       if (rapp.type !== undefined) {
//         updateOperations.$set.modelType = rapp.type;
//         updateOperations.$unset = { type: '' }; // Remove old field
//       }

//       // Rename `featured` to `isFeatured`
//       if (rapp.featured !== undefined) {
//         updateOperations.$set.isFeatured = rapp.featured;
//         updateOperations.$unset = { featured: '' }; // Remove old field
//       }

//       // Calculate `totalCost` (if computationcost and commission exist)
//       if (rapp.computationcost !== undefined && rapp.commission !== undefined) {
//         updateOperations.$set.totalCost = rapp.computationcost + rapp.commission;
//         updateOperations.$unset = { computationcost: '', commission: '' }; // Remove old fields
//       }

//       // Add new fields with default values ONLY if they don't already exist
//       if (rapp.key === undefined) updateOperations.$set.key = 'test'; // Default value for `key`
//       if (rapp.userRatings === undefined) updateOperations.$set.userRatings = []; // Default value for `userRatings`
//       if (rapp.userComment === undefined) updateOperations.$set.userComment = []; // Default value for `userComment`
//       if (rapp.getprompt === undefined) updateOperations.$set.getprompt = false; // Default value for `getprompt`
//       if (rapp.promptcost === undefined) updateOperations.$set.promptcost = 0; // Default value for `promptcost`
//       if (rapp.promptpurchase === undefined) updateOperations.$set.promptpurchase = []; // Default value for `promptpurchase`

//       // Preserve existing fields
//       if (rapp.systemprompt !== undefined) updateOperations.$set.systemprompt = rapp.systemprompt;
//       if (rapp.prompt !== undefined) updateOperations.$set.prompt = rapp.prompt;
//       if (rapp.negativeprompt !== undefined) updateOperations.$set.negativeprompt = rapp.negativeprompt;
//       if (rapp.status !== undefined) updateOperations.$set.status = rapp.status;
//       if (rapp.name !== undefined) updateOperations.$set.name = rapp.name;
//       if (rapp.description !== undefined) updateOperations.$set.description = rapp.description;
//       if (rapp.price !== undefined) updateOperations.$set.price = rapp.price;
//       if (rapp.tokens !== undefined) updateOperations.$set.tokens = rapp.tokens;
//       if (rapp.image !== undefined) updateOperations.$set.image = rapp.image;
//       if (rapp.creator !== undefined) updateOperations.$set.creator = rapp.creator;
//       if (rapp.systemVariables !== undefined) updateOperations.$set.systemVariables = rapp.systemVariables;
//       if (rapp.promptVariables !== undefined) updateOperations.$set.promptVariables = rapp.promptVariables;
//       if (rapp.negativeVariables !== undefined) updateOperations.$set.negativeVariables = rapp.negativeVariables;
//       if (rapp.settings !== undefined) updateOperations.$set.settings = rapp.settings;
//       if (rapp.slug !== undefined) updateOperations.$set.slug = rapp.slug;
//       if(rapp.private !== undefined) updateOperations.$unset.private = '';

//       // Function to convert [variable] to ${variable} and extract variables
//       const convertAndExtractVariables = (text: string, prefix: string) => {
//         if (!text) return { updatedText: text, variables: [] };

//         // Convert [variable] to ${variable}
//         const updatedText = text.replace(/\[([^\]]+)\]/g, '$$$$$1');

//         // Extract variables from the updated text
//         const variables = updatedText.match(/\$\$([^\s]+)/g) || [];
//         // Create variables array
//         const variableObjects = variables.map((variable, index) => {
//           const varName = variable.startsWith('$$') ? variable.slice(2) : variable;
//           return {
//             name: variable,
//             identifier: `${prefix}-${Date.now()}-${index}`,
//             displayName: {varName},
//             description: `Description for ${varName}`,
//             placeholder: `Enter ${varName}`,
//             type: 'string',
//             allowMultiple: false,
//             options: [],
//           };
//         });

//         return { updatedText, variables: variableObjects };
//       };

//       // Update prompt, systemprompt, and negativeprompt fields
//       if (rapp.prompt) {
//         const { updatedText, variables } = convertAndExtractVariables(rapp.prompt, 'prompt');
//         updateOperations.$set.prompt = updatedText;
//         if (variables.length > 0) {
//           updateOperations.$set.promptVariables = variables;
//         }
//       }

//       if (rapp.systemprompt) {
//         const { updatedText, variables } = convertAndExtractVariables(rapp.systemprompt, 'systemprompt');
//         updateOperations.$set.systemprompt = updatedText;
//         if (variables.length > 0) {
//           updateOperations.$set.systemVariables = variables;
//         }
//       }

//       if (rapp.negativeprompt) {
//         const { updatedText, variables } = convertAndExtractVariables(rapp.negativeprompt, 'negativeprompt');
//         updateOperations.$set.negativeprompt = updatedText;
//         if (variables.length > 0) {
//           updateOperations.$set.negativeVariables = variables;
//         }
//       }

//       // Migrate replicate settings to the unified `settings` field
//       const settings = {};

//       // Migrate textreplicatesetting
//       if (rapp.textreplicatesettings && typeof rapp.textreplicatesettings === 'object') {
//         for (const [key, value] of Object.entries(rapp.textreplicatesettings)) {
//           settings[`${key}`] = value; // Prefix with "text_" to avoid conflicts
//         }
//         updateOperations.$unset.textreplicatesettings = ''; // Remove old field
//       }

//       // Migrate imagereplicatesettings
//       if (rapp.imagereplicatesettings && typeof rapp.imagereplicatesettings === 'object') {
//         for (const [key, value] of Object.entries(rapp.imagereplicatesettings)) {
//           settings[`${key}`] = value; // Prefix with "image_" to avoid conflicts
//         }
//         updateOperations.$unset.imagereplicatesettings = ''; // Remove old field
//       }

//       // Migrate modelaudiofalsetting
//       if (rapp.ModelAudioFalSettings && typeof rapp.ModelAudioFalSettings === 'object') {
//         for (const [key, value] of Object.entries(rapp.ModelAudioFalSettings)) {
//           settings[`${key}`] = value; // Prefix with "audio_" to avoid conflicts
//         }
//         updateOperations.$unset.ModelAudioFalSettings = ''; // Remove old field
//       }

//       // Merge new settings with existing settings (if any)
//       if (rapp.settings) {
//         updateOperations.$set.settings = { ...rapp.settings, ...settings };
//       } else {
//         updateOperations.$set.settings = settings;
//       }

//       // Apply the update to the rapp
//       if (Object.keys(updateOperations).length > 0) {
//         await rappsCollection.updateOne(
//           { _id: rapp._id }, // Filter by rapp ID
//           updateOperations
//         );
//       }
//     }

//     console.log('Migration completed successfully!');
//   } catch (error) {
//     console.error('Error during migration:', error);
//   } finally {
//     await client.close();
//   }
// }





// export async function migrateUsers() {
//     const uri = 'mongodb+srv://0701cs201014:YEo65XKmfynihBFH@cluster0.aqin6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/test'; // Replace with your MongoDB URI
//     const client = new MongoClient(uri);

//   try {
//     await client.connect();
//     const database = client.db('test'); // Replace with your database name
//     const usersCollection = database.collection('users');

//         // Fetch all users
//         const users = await usersCollection.find({}).toArray();

//         // Loop through each user and apply updates
//         for (const user of users) {
//             const updateOperations = {};
//             if (!updateOperations.$set) updateOperations.$set = {};

//             // Add new fields with default values ONLY if they don't already exist
//             if (!user.tokens) updateOperations.$set.tokens = 0;
//             if (!user.domain) updateOperations.$set.domain = '';

//             // Handle members field: preserve existing data
//             if (!user.members || !Array.isArray(user.members)) {
//                 updateOperations.$set.members = []; // Set to empty array if it doesn't exist or is invalid
//             }

//             if (!user.rappAccess) updateOperations.$set.rappAccess = [];
//             if (!user.privateRapps) updateOperations.$set.privateRapps = [];
//             if (!user.createRappPermission) updateOperations.$set.createRappPermission = false;

//             // Preserve existing associatedWith value unless it needs to be updated
//             if (!user.associatedWith) {
//                 updateOperations.$set.associatedWith = null; // Only set to null if it doesn't exist
//             }

//             // Update gender field to ensure hasMany: false
//             if (user.genInfo?.gender && Array.isArray(user.genInfo.gender)) {
//                 updateOperations.$set['genInfo.gender'] = user.genInfo.gender[0] || null; // Take the first value
//             }

//             // Update userType field to include "student" option
//             if (user.userType && !['individual', 'enterprise', 'student'].includes(user.userType)) {
//                 updateOperations.$set.userType = 'individual'; // Default to "individual" if invalid
//             }

//             // Remove AuthProvider field ONLY if it exists
//             if (user.AuthProvider !== undefined) {
//                 updateOperations.$unset = {
//                     AuthProvider: '', // Remove old field
//                 };
//             }

//             // Remove publicRapps field if it exists
//             if (user.publicRapps !== undefined) {
//                 if (!updateOperations.$unset) updateOperations.$unset = {};
//                 updateOperations.$unset.publicRapps = ''; // Remove publicRapps field
//             }

//             // Apply the update to the user
//             if (Object.keys(updateOperations).length > 0) {
//                 await usersCollection.updateOne(
//                     { _id: user._id }, // Filter by user ID
//                     updateOperations
//                 );
//             }
//         }

//         console.log('Migration completed successfully!');
//     } catch (error) {
//         console.error('Error during migration:', error);
//     } finally {
//         await client.close();
//     }
// }





// export async function migrateModels() {
//   const uri = 'mongodb+srv://0701cs201014:YEo65XKmfynihBFH@cluster0.aqin6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/test'; // Replace with your MongoDB URI
//   const client = new MongoClient(uri);

//   try {
//     await client.connect();
//     const database = client.db('test'); // Replace with your database name
//     const modelsCollection = database.collection('models');

//     // Fetch all documents in the `models` collection
//     const rawModels = await modelsCollection.find({}).toArray();
//     for (const model of rawModels) {
//       const objectId = model._id;
//       const idString = objectId.toString();
//       console.log('Updating document with ID:', idString);

//       let systemPrompt;
//       let negativePrompt;

//       if(model.type === 'text'){
//         systemPrompt = true;
//         negativePrompt = false;
//       } else if(model.type === 'image'){
//         if(model.name === 'codeformer'){
//           negativePrompt = false;
//           systemPrompt = false;
//         }else{
//           negativePrompt = true;
//           systemPrompt = false;
//         }
//       }else{
//         negativePrompt = false;
//         systemPrompt = false;
//       }

//       let commissionApplicable;
//       if(model.commision > 0){
//         commissionApplicable = true;
//       }else{
//         commissionApplicable = false;
//       }

//       // Update the `provider` field if it exists
//       if (model.provider && typeof model.provider === 'object' && model.provider.text) {
//         // If provider is an object with a `text` property, extract the value
//         model.provider = model.provider.text;
//       } else if (model.provider && typeof model.provider === 'object' && model.provider.image) {
//         // If provider is already a string, keep it as is
//         model.provider = model.provider.image;
//       }
//       else if (model.provider && typeof model.provider === 'object' && model.provider.audio) {
//         // If provider is already a string, keep it as is
//         model.provider = model.provider.audio;
//       }
//       else if (model.provider && typeof model.provider === 'object' && model.provider.video) {
//         // If provider is already a string, keep it as is
//         model.provider = model.provider.video;
//       }
//       else if (model.provider && typeof model.provider === 'object' && model.provider.vision) {
//         // If provider is already a string, keep it as is
//         model.provider = model.provider.vision;
//       }

//       let modelSettings;
      
//       // Transform the `settings` field
//       if (model.type && model.provider) {
//         const settings = transformSettings(model.type, model.provider, model);
//         modelSettings = settings;
//       } else {
//         console.log(`Skipping settings update for document with ID ${idString}: type or provider field is missing.`);
//       }

//       // Transform the `keys` field
//       if (model.keys) {
//         const { prodkeys, testkeys } = transformKeys(model.keys);
//         model.prodkeys = prodkeys;
//         model.testkeys = testkeys;
//         delete model.keys; // Remove the old `keys` field
//       } else {
//         console.log(`Skipping keys update for document with ID ${idString}: keys field is missing.`);}

//       const result = await modelsCollection.updateOne(
//         { _id: objectId }, // Filter by document ID
//         { $set: {
//             provider: model.provider,
//             systemprompt: systemPrompt,
//             negativeprompt: negativePrompt,
//             commissionapplicable: commissionApplicable,
//             tokens: 0,
//             settings: modelSettings,
//             prodkeys: model.prodkeys,
//             testkeys: model.testkeys,
//           },
//           $unset: { keys: '' }, } // Update the `provider`, `settings`, and `keys` fields
//       );
//       console.log('Update result:', result);
//     }
//   } finally {
//     await client.close();
//   }
// }

// // Helper function to transform settings
// function transformSettings(type, provider, model) {
//   // Determine which settings field to use based on type and provider
//   let settingsArray;
//   if (type === 'image' && provider === 'replicate') {
//     settingsArray = model.settings.replicateimagesettings || [];
//   } else if (type === 'text' && provider === 'replicate') {
//     settingsArray = model.settings.replicatetextsettings || [];
//   }
//   else if (type === 'text' && provider === 'groq') {
//     settingsArray = model.settings.groqtextsettings || [];
//   } else if (type === 'vision' && provider === 'groq') {
//     settingsArray = model.settings.groqvisionsettings || [];
//   } else if (type === 'text' && provider === 'openai') {
//     settingsArray = model.settings.openaitextsettings || [];
//   }
//   else if (type === 'video' && provider === 'fal') {
//     settingsArray = model.settings.falvideosettings || [];
//   } else if (type === 'audio' && provider === 'fal') {
//     settingsArray = model.settings.falaudiosettings || [];
//   } else if (type === 'vision' && provider === 'openai') {
//     settingsArray = model.settings.openaivisionsettings || [];
//   } else {
//     settingsArray = [];
//   }


//   // Transform the settings array into the new structure
//   const transformedSettings = settingsArray.map((setting, index) => ({
//     name: setting,
//     type: 'integer', // Default type, can be adjusted based on your data
//     description: `Description for ${setting}`,
//     allowMultiple: false, // Default value, can be adjusted based on your data
//     id: `${model._id.toString()}-${index}`, // Generate a unique ID for each setting
//   }));

//   return transformedSettings;
// }



// // Helper function to transform keys
// function transformKeys(keys) {
//   const prodkeys = {};
//   const testkeys = {};

//   // Map existing keys to the new structure
//   for (const [key, value] of Object.entries(keys)) {
//     const provider = key.replace(/^text|image|audio|video|vision/, '').toLowerCase(); // Extract provider name (e.g., groq, replicate, openai)

//     if (provider === 'groq' || provider === 'replicate' || provider === 'openai') {
//       // Transform groq, replicate, and openai keys
//       if (value.testname && value.testapikey) {
//         testkeys[provider] = {
//           modelname: value.testname,
//           apikey: value.testapikey,
//         };
//       }
//       if (value.prodname && value.prodapikey) {
//         prodkeys[provider] = {
//           modelname: value.prodname,
//           apikey: value.prodapikey,
//         };
//       }
//     }
//   }

//   return { prodkeys, testkeys };
// }




