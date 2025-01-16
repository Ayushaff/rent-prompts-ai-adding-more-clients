import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import slugify from 'slugify'; // Install slugify for generating slugs

// Load environment variables from .env file
dotenv.config();

async function migrateRapps() {
    const uri = process.env.DATABASE_URI; // Use environment variable
    const databaseName = "test"; // Use environment variable
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db(databaseName);
        const rappsCollection = database.collection('rapps');

        // Fetch all rapps
        const rapps = await rappsCollection.find({}).toArray();

        // Loop through each rapp and apply updates
        for (const rapp of rapps) {
            const updateOperations = {};

            // Initialize $set if it doesn't exist
            if (!updateOperations.$set) updateOperations.$set = {};

            // Rename `type` to `modelType`
            if (rapp.type !== undefined) {
                updateOperations.$set.modelType = rapp.type;
                updateOperations.$unset = { type: '' }; // Remove old field
            }

            // Rename `featured` to `isFeatured`
            if (rapp.featured !== undefined) {
                updateOperations.$set.isFeatured = rapp.featured;
                updateOperations.$unset = { featured: '' }; // Remove old field
            }

            // Calculate `totalCost` (if computationcost and commission exist)
            if (rapp.computationcost !== undefined && rapp.commission !== undefined) {
                updateOperations.$set.totalCost = rapp.computationcost + rapp.commission;
                updateOperations.$unset = { computationcost: '', commission: '' }; // Remove old fields
            }

            // // Generate a unique slug if it doesn't exist
            // if (!rapp.slug || rapp.slug === '') {
            //     const baseSlug = slugify(rapp.name, { lower: true, strict: true }); // Generate slug from name
            //     const uniqueSlug = `${baseSlug}-${rapp._id.toString().slice(-6)}`; // Append last 6 chars of _id for uniqueness
            //     updateOperations.$set.slug = uniqueSlug;
            // }

            // Add new fields with default values ONLY if they don't already exist
            if (rapp.key === undefined) updateOperations.$set.key = 'test'; // Default value for `key`
            if (rapp.userRatings === undefined) updateOperations.$set.userRatings = []; // Default value for `userRatings`
            if (rapp.userComment === undefined) updateOperations.$set.userComment = []; // Default value for `userComment`
            if (rapp.getprompt === undefined) updateOperations.$set.getprompt = false; // Default value for `getprompt`
            if (rapp.promptcost === undefined) updateOperations.$set.promptcost = 0; // Default value for `promptcost`
            if (rapp.promptpurchase === undefined) updateOperations.$set.promptpurchase = []; // Default value for `promptpurchase`
            // Preserve existing fields
            if (rapp.systemprompt !== undefined) updateOperations.$set.systemprompt = rapp.systemprompt;
            if (rapp.prompt !== undefined) updateOperations.$set.prompt = rapp.prompt;
            if (rapp.negativeprompt !== undefined) updateOperations.$set.negativeprompt = rapp.negativeprompt;
            if (rapp.status !== undefined) updateOperations.$set.status = rapp.status;
            if (rapp.name !== undefined) updateOperations.$set.name = rapp.name;
            if (rapp.description !== undefined) updateOperations.$set.description = rapp.description;
            if (rapp.price !== undefined) updateOperations.$set.price = rapp.price;
            if (rapp.tokens !== undefined) updateOperations.$set.tokens = rapp.tokens;
            if (rapp.image !== undefined) updateOperations.$set.image = rapp.image;
            if (rapp.creator !== undefined) updateOperations.$set.creator = rapp.creator;
            if (rapp.systemVariables !== undefined) updateOperations.$set.systemVariables = rapp.systemVariables;
            if (rapp.promptVariables !== undefined) updateOperations.$set.promptVariables = rapp.promptVariables;
            if (rapp.negativeVariables !== undefined) updateOperations.$set.negativeVariables = rapp.negativeVariables;
            if (rapp.settings !== undefined) updateOperations.$set.settings = rapp.settings;
            if(rapp.slug !== undefined) updateOperations.$set.slug = rapp.slug;
            // Apply the update to the rapp
            if (Object.keys(updateOperations).length > 0) {
                await rappsCollection.updateOne(
                    { _id: rapp._id }, // Filter by rapp ID
                    updateOperations
                );
            }
        }

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Error during migration:', error);
    } finally {
        await client.close();
    }
}

migrateRapps();