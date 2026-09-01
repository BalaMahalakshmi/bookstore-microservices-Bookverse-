import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone

# 🔴 CHANGE THIS TO YOUR MONGODB ATLAS URL
MONGODB_URL = "mongodb://mahabi:Mahabi0403@ac-zomzw8x-shard-00-00.09fxlur.mongodb.net:27017,ac-zomzw8x-shard-00-01.09fxlur.mongodb.net:27017,ac-zomzw8x-shard-00-02.09fxlur.mongodb.net:27017/?ssl=true&replicaSet=atlas-pdmg6q-shard-0&authSource=admin&appName=Cluster0"

DATABASE_NAME = "bookstore"

books_data = [
    {
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "description": "A novel set in the Jazz Age that tells the story of Jay Gatsby's unrequited love for Daisy Buchanan. It explores themes of decadence, idealism, resistance to change, social upheaval, and excess.",
        "price": 12.99,
        "category": "Classic Literature",
        "stock": 45,
        "rating": 4.5,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "description": "A gripping tale of racial injustice and childhood innocence in the American South. Scout Finch narrates the story of her father, Atticus, defending a Black man falsely accused of a crime.",
        "price": 14.50,
        "category": "Classic Literature",
        "stock": 38,
        "rating": 4.8,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "title": "1984",
        "author": "George Orwell",
        "description": "A dystopian social science fiction novel that follows Winston Smith as he rebels against the totalitarian Party led by Big Brother. A chilling prophecy of a surveillance state.",
        "price": 11.99,
        "category": "Science Fiction",
        "stock": 52,
        "rating": 4.7,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "title": "The Alchemist",
        "author": "Paulo Coelho",
        "description": "A philosophical novel about Santiago, an Andalusian shepherd boy who travels from Spain to Egypt in search of treasure. A journey of self-discovery and following one's dreams.",
        "price": 16.00,
        "category": "Fiction",
        "stock": 60,
        "rating": 4.6,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "title": "Clean Code",
        "author": "Robert C. Martin",
        "description": "A must-read for software developers. This book teaches you how to write clean, maintainable, and efficient code. Covers principles, patterns, and practices of agile software craftsmanship.",
        "price": 42.99,
        "category": "Technology",
        "stock": 25,
        "rating": 4.9,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "title": "The Pragmatic Programmer",
        "author": "Andrew Hunt & David Thomas",
        "description": "Your journey to mastery in programming. This book covers essential topics from career development to architectural techniques for keeping your code flexible and reusable.",
        "price": 49.99,
        "category": "Technology",
        "stock": 30,
        "rating": 4.8,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "title": "Harry Potter and the Sorcerer's Stone",
        "author": "J.K. Rowling",
        "description": "The first book in the Harry Potter series. Follow Harry as he discovers he's a wizard and begins his magical education at Hogwarts School of Witchcraft and Wizardry.",
        "price": 18.99,
        "category": "Fantasy",
        "stock": 75,
        "rating": 4.9,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "title": "The Hobbit",
        "author": "J.R.R. Tolkien",
        "description": "Bilbo Baggins, a hobbit, is swept into an epic quest to reclaim the lost Dwarf Kingdom of Erebor from the fearsome dragon Smaug. A timeless adventure for all ages.",
        "price": 15.99,
        "category": "Fantasy",
        "stock": 40,
        "rating": 4.7,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "title": "Sapiens: A Brief History of Humankind",
        "author": "Yuval Noah Harari",
        "description": "A groundbreaking narrative of humanity's creation and evolution that explores the ways in which biology and history have defined us and enhanced our understanding of what it means to be human.",
        "price": 22.99,
        "category": "Non-Fiction",
        "stock": 35,
        "rating": 4.6,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "title": "Atomic Habits",
        "author": "James Clear",
        "description": "No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies that will teach you exactly how to form good habits and break bad ones.",
        "price": 19.99,
        "category": "Self-Help",
        "stock": 80,
        "rating": 4.8,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "title": "The Psychology of Money",
        "author": "Morgan Housel",
        "description": "Timeless lessons on wealth, greed, and happiness. This book explores how people think about money and teaches you how to make better financial decisions.",
        "price": 17.50,
        "category": "Finance",
        "stock": 55,
        "rating": 4.7,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "title": "Rich Dad Poor Dad",
        "author": "Robert T. Kiyosaki",
        "description": "A personal finance classic that challenges the way you think about money. Learn what the rich teach their kids about money that the poor and middle class do not.",
        "price": 14.99,
        "category": "Finance",
        "stock": 65,
        "rating": 4.5,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "title": "Deep Work",
        "author": "Cal Newport",
        "description": "Rules for focused success in a distracted world. Learn how to develop the superpower of deep work and achieve extraordinary results in less time.",
        "price": 21.00,
        "category": "Self-Help",
        "stock": 42,
        "rating": 4.6,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "title": "Dune",
        "author": "Frank Herbert",
        "description": "Set on the desert planet Arrakis, Dune is the story of Paul Atreides, who would become the mysterious man known as Muad'Dib. A masterpiece of science fiction.",
        "price": 18.50,
        "category": "Science Fiction",
        "stock": 28,
        "rating": 4.8,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "title": "The Lean Startup",
        "author": "Eric Ries",
        "description": "How today's entrepreneurs use continuous innovation to create radically successful businesses. A revolutionary approach to building companies in the age of uncertainty.",
        "price": 24.99,
        "category": "Business",
        "stock": 33,
        "rating": 4.4,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "title": "Zero to One",
        "author": "Peter Thiel",
        "description": "Notes on startups, or how to build the future. Peter Thiel shares his unique perspective on innovation, competition, and building companies that create new things.",
        "price": 20.99,
        "category": "Business",
        "stock": 27,
        "rating": 4.5,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "title": "Thinking, Fast and Slow",
        "author": "Daniel Kahneman",
        "description": "The groundbreaking book that explains the two systems that drive the way we think. System 1 is fast, intuitive, and emotional; System 2 is slower, more deliberative, and more logical.",
        "price": 16.99,
        "category": "Psychology",
        "stock": 50,
        "rating": 4.6,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "title": "Becoming",
        "author": "Michelle Obama",
        "description": "A deeply personal memoir by the former First Lady of the United States. Michelle Obama invites readers into her world, chronicling the experiences that have shaped her.",
        "price": 18.00,
        "category": "Biography",
        "stock": 48,
        "rating": 4.7,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "title": "Steve Jobs",
        "author": "Walter Isaacson",
        "description": "The exclusive biography of Steve Jobs, based on over forty interviews with Jobs conducted over two years. A candid, inspiring, and personal account of the visionary Apple co-founder.",
        "price": 23.99,
        "category": "Biography",
        "stock": 22,
        "rating": 4.6,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "title": "The Art of War",
        "author": "Sun Tzu",
        "description": "An ancient Chinese military treatise dating from the Late Spring and Autumn Period. It has influenced military thinking, business tactics, legal strategy, and beyond for centuries.",
        "price": 9.99,
        "category": "History",
        "stock": 90,
        "rating": 4.5,
        "created_at": datetime.now(timezone.utc).isoformat(),
    },
]


async def seed_database():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]

    # Clear existing books
    await db.books.delete_many({})
    print("🗑️  Cleared existing books")

    # Insert new books
    result = await db.books.insert_many(books_data)
    print(f"✅ Inserted {len(result.inserted_ids)} books successfully!")

    # Show all categories
    categories = await db.books.distinct("category")
    print(f"📚 Categories: {', '.join(categories)}")

    # Show total count
    total = await db.books.count_documents({})
    print(f"📖 Total books in database: {total}")

    client.close()


if __name__ == "__main__":
    print("🚀 Starting database seeding...")
    asyncio.run(seed_database())
    print("✨ Done!")
