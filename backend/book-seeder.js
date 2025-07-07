// book-seeder.js
const axios = require("axios");
const { sql, getConnection } = require("./config/db");

// Configuration
const BOOKS_TO_FETCH = 102; // Number of books to add
const MAX_RETRIES = 3; // Maximum retry attempts for API calls

// Using your exact category IDs from the database
const CATEGORIES_MAP = {
  Fiction: 1, // CategoryID 1
  "Non-Fiction": 2, // CategoryID 2
  Science: 3, // CategoryID 3
  History: 4, // CategoryID 4
  Technology: 5, // CategoryID 5
  Literature: 6, // CategoryID 6
};

// Reset database identity counter (run this first to start IDs at 1)
async function resetDatabaseIdentities() {
  try {
    const pool = await getConnection();

    // Delete existing books and reset identity counter
    await pool.request().query(`
      -- Clear existing book-related data
      DELETE FROM BookReviews;
      DELETE FROM BorrowingHistory;
      DELETE FROM BookAuthors;
      DELETE FROM Books;
      
      -- Reset identity counter to start from 1
      DBCC CHECKIDENT ('Books', RESEED, 0);
    `);

    console.log("✅ Database reset complete. Book IDs will start from 1.");
  } catch (err) {
    console.error("❌ Failed to reset database:", err.message);
  }
}

// Function to map Open Library subject to our database category IDs
function mapCategory(subjects) {
  if (!subjects || subjects.length === 0) return 1; // Default to Fiction

  // Convert all subjects to lowercase for easier matching
  const lowerSubjects = subjects.map((s) => s.toLowerCase());

  // Match to your specific CategoryIDs
  if (lowerSubjects.some((s) => s.includes("fiction") || s.includes("novel")))
    return 1;
  if (
    lowerSubjects.some(
      (s) => s.includes("non-fiction") || s.includes("biography")
    )
  )
    return 2;
  if (
    lowerSubjects.some(
      (s) =>
        s.includes("science") || s.includes("physics") || s.includes("biology")
    )
  )
    return 3;
  if (lowerSubjects.some((s) => s.includes("history"))) return 4;
  if (
    lowerSubjects.some(
      (s) =>
        s.includes("technology") ||
        s.includes("computer") ||
        s.includes("programming")
    )
  )
    return 5;
  if (
    lowerSubjects.some(
      (s) =>
        s.includes("literature") || s.includes("poetry") || s.includes("drama")
    )
  )
    return 6;

  return 1; // Default to Fiction if no match
}

// Function to insert a book using your existing stored procedure
async function insertBook(bookData) {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("Title", sql.NVarChar, bookData.title)
      .input("CategoryID", sql.Int, bookData.categoryId)
      .input("PublishYear", sql.Int, bookData.publishYear)
      .input("TotalCopies", sql.Int, bookData.totalCopies)
      .input("Description", sql.NVarChar, bookData.description)
      .execute("InsertBook"); // Using your existing stored procedure

    console.log(`✅ Book inserted with ID: ${result.recordset[0].BookID}`);
    return result.recordset[0].BookID;
  } catch (err) {
    console.error(`❌ Failed to insert book "${bookData.title}":`, err.message);
    return null;
  }
}

// Function to insert an author using your existing stored procedure
async function insertAuthor(authorName) {
  try {
    const pool = await getConnection();

    // First check if author already exists
    const checkResult = await pool
      .request()
      .input("AuthorName", sql.NVarChar, authorName)
      .query("SELECT AuthorID FROM Authors WHERE AuthorName = @AuthorName");

    if (checkResult.recordset.length > 0) {
      console.log(
        `👥 Author "${authorName}" already exists with ID: ${checkResult.recordset[0].AuthorID}`
      );
      return checkResult.recordset[0].AuthorID;
    }

    // Insert new author if not found
    const result = await pool
      .request()
      .input("AuthorName", sql.NVarChar, authorName)
      .input("Biography", sql.NVarChar, null)
      .execute("InsertAuthor"); // Using your existing stored procedure

    console.log(
      `👤 New author "${authorName}" inserted with ID: ${result.recordset[0].AuthorID}`
    );
    return result.recordset[0].AuthorID;
  } catch (err) {
    console.error(`❌ Failed to insert author "${authorName}":`, err.message);
    return null;
  }
}

// Function to assign author to book using your existing stored procedure
async function assignAuthorToBook(authorId, bookId) {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("AuthorID", sql.Int, authorId)
      .input("BookID", sql.Int, bookId)
      .execute("AssignAuthorToBook"); // Using your existing stored procedure

    console.log(`🔗 Linked author ID ${authorId} to book ID ${bookId}`);
    return true;
  } catch (err) {
    console.error(
      `❌ Failed to assign author ${authorId} to book ${bookId}:`,
      err.message
    );
    return false;
  }
}

// Delay function to prevent rate limiting
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to fetch book details from Open Library with retry logic
async function fetchBookDetails(workId, retries = 0) {
  try {
    const response = await axios.get(
      `https://openlibrary.org/works/${workId}.json`
    );
    return response.data;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.log(
        `Retrying fetch for ${workId}... (${retries + 1}/${MAX_RETRIES})`
      );
      await delay(2000); // Longer delay before retry
      return fetchBookDetails(workId, retries + 1);
    }
    console.error(`Error fetching details for work ${workId}:`, error.message);
    return null;
  }
}

// Get a valid publish year within acceptable range
function getValidPublishYear(year) {
  const currentYear = new Date().getFullYear();

  // If year is missing or invalid, return a default year
  if (!year || year < 1800 || year > currentYear) {
    return 2000; // Default value
  }

  return year;
}

// Main function to fetch books from Open Library API and insert them
async function seedBooksFromAPI() {
  try {
    // Reset database identities first
    await resetDatabaseIdentities();

    // Mapping subjects to your categories
    const subjects = [
      "fiction", // Maps to CategoryID 1
      "non-fiction", // Maps to CategoryID 2
      "science", // Maps to CategoryID 3
      "history", // Maps to CategoryID 4
      "technology", // Maps to CategoryID 5
      "literature", // Maps to CategoryID 6
    ];

    let booksProcessed = 0;
    let failedBooks = 0;

    for (const subject of subjects) {
      if (booksProcessed >= BOOKS_TO_FETCH) break;

      console.log(`\n📚 Fetching books for subject: ${subject}`);

      // Try with retries
      let response = null;
      let retries = 0;

      while (!response && retries < MAX_RETRIES) {
        try {
          response = await axios.get(
            `https://openlibrary.org/subjects/${subject}.json`,
            {
              params: {
                limit: 25, // Increased from 17 to ensure enough books per category
              },
            }
          );
        } catch (error) {
          retries++;
          console.log(
            `Retrying subject ${subject} (${retries}/${MAX_RETRIES})...`
          );
          await delay(2000);
        }
      }

      if (
        !response ||
        !response.data.works ||
        response.data.works.length === 0
      ) {
        console.log(`No books found for subject: ${subject}`);
        continue;
      }

      for (const work of response.data.works) {
        if (booksProcessed >= BOOKS_TO_FETCH) break;

        // Skip if essential data is missing
        if (!work.title) {
          console.log("Skipping book with missing title");
          continue;
        }

        // Add a small delay to avoid rate limiting
        await delay(1500);

        // Get more details about the book
        const workId = work.key.split("/").pop();
        console.log(`Fetching details for: ${work.title} (ID: ${workId})`);
        const bookDetails = await fetchBookDetails(workId);

        if (!bookDetails) {
          console.log("Could not fetch book details, skipping...");
          failedBooks++;
          continue;
        }

        // Extract book data with improved validation
        const bookData = {
          title: work.title.substring(0, 254), // Ensure within varchar(255)
          categoryId: mapCategory(work.subject || []),
          publishYear: getValidPublishYear(work.first_publish_year),
          totalCopies: Math.floor(Math.random() * 5) + 3, // Random number between 3-7
          description: bookDetails.description
            ? typeof bookDetails.description === "string"
              ? bookDetails.description.substring(0, 1000)
              : bookDetails.description.value
              ? bookDetails.description.value.substring(0, 1000)
              : "No description available"
            : "No description available",
        };

        // Insert book
        console.log(
          `\n📖 Inserting book: "${bookData.title}" (Category: ${bookData.categoryId}, Year: ${bookData.publishYear})`
        );
        const bookId = await insertBook(bookData);

        if (bookId) {
          // Insert authors and link them to the book
          const authors = work.authors || [];
          if (authors.length === 0) {
            console.log("⚠️ No authors found for this book");
            // Insert "Unknown Author" when no authors are available
            const unknownAuthorId = await insertAuthor("Unknown Author");
            if (unknownAuthorId) {
              await assignAuthorToBook(unknownAuthorId, bookId);
            }
          } else {
            for (const authorObj of authors) {
              const authorName = authorObj.name;
              if (authorName) {
                const authorId = await insertAuthor(authorName);
                if (authorId) {
                  await assignAuthorToBook(authorId, bookId);
                  console.log(
                    `✅ Assigned author "${authorName}" to book "${bookData.title}"`
                  );
                }
              }
            }
          }

          booksProcessed++;
          console.log(
            `✅ Successfully processed book ${booksProcessed}/${BOOKS_TO_FETCH}`
          );
        } else {
          failedBooks++;
        }
      }
    }

    console.log(
      `\n🎉 Database seeding completed! Added ${booksProcessed} books. Failed: ${failedBooks}.`
    );

    // If we didn't reach our target, print a warning
    if (booksProcessed < BOOKS_TO_FETCH) {
      console.log(
        `⚠️ Warning: Only inserted ${booksProcessed} out of ${BOOKS_TO_FETCH} requested books.`
      );
      console.log("Consider running the seeder again to add more books.");
    }
  } catch (error) {
    console.error("Error in seed process:", error);
  }
}

// Run the seeder
console.log("Starting LibSynx database seeder...");
seedBooksFromAPI()
  .then(() => {
    console.log("Seeding process finished successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Fatal error in seeding process:", err);
    process.exit(1);
  });
