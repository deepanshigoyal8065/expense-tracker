import mongoose from 'mongoose'
import { env } from '../config/env.js'

const fixBudgetIndex = async () => {
  try {
    await mongoose.connect(env.mongoUri)
    console.log('✅ Connected to MongoDB')

    const db = mongoose.connection.db
    const collection = db.collection('budgets')

    // List current indexes
    const indexes = await collection.indexes()
    console.log('\n📋 Current indexes:')
    indexes.forEach(idx => {
      console.log(`  - ${idx.name}:`, idx.key)
    })

    // Drop the incorrect index (month_1)
    try {
      await collection.dropIndex('month_1')
      console.log('\n✅ Dropped incorrect index: month_1')
    } catch (err) {
      if (err.code === 27) {
        console.log('\n⚠️  Index "month_1" does not exist (already removed)')
      } else {
        throw err
      }
    }

    // List updated indexes
    const updatedIndexes = await collection.indexes()
    console.log('\n📋 Updated indexes:')
    updatedIndexes.forEach(idx => {
      console.log(`  - ${idx.name}:`, idx.key)
    })

    console.log('\n✨ Done! You should now have only:')
    console.log('  - _id_ (default)')
    console.log('  - userId_1_month_1 (compound unique index)')

    await mongoose.connection.close()
    process.exit(0)
  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

fixBudgetIndex()
