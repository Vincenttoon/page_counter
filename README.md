const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [savedBookIds, setSavedBookIds] = useState(Auth.getSavedBookIds()); // Use a function to get saved book IDs from local storage

  const [saveBook] = useMutation(SAVE_BOOK);
  const [stashBook] = useMutation(STASH_BOOK);

  

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`
      );
      const data = await response.json();
      setSearchResults(data.items);
    } catch (error) {
      console.error("Error searching Google Books API:", error);
    }
  };

  const navigate = useNavigate();

  const handleSaveBook = (book) => {
    if (book && book.volumeInfo) {
      // Create the input object with the book data
      const input = {
        bookInfo: {
          // Populate the bookInfo object with the relevant data from your book object
          bookId: book.id,
          authors: book.volumeInfo.authors,
          description: book.volumeInfo.description,
          image: book.volumeInfo.imageLinks.thumbnail,
          link: book.volumeInfo.link,
          title: book.volumeInfo.title,
          averageRating: book.volumeInfo.averageRating,
          pageCount: book.volumeInfo.pageCount,
        },
        savedAt: new Date().toISOString(),
      };

      // Log the input object to the console
      console.log("Input object:", input);

      // Make the saveBook mutation
      saveBook({
        variables: {
          input,
        },
      })
        .then((response) => {
          // Handle the response, for example, show a success message.
          console.log("Book saved successfully:", response);
        })
        .catch((error) => {
          // Handle errors, for example, show an error message.
          console.error("Error saving book:", error);
        });
    } else {
      console.error("Invalid book data");
    }
  };

  const handleStashBook = (bookId) => {
    const bookToStash = searchResults.find((book) => book.id === bookId);

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    const input = {
      bookInfo: {
        bookId: bookId,
        authors: bookToStash.volumeInfo.authors || ["No author to display"],
        title: bookToStash.volumeInfo.title,
        description: bookToStash.volumeInfo.description,
        image: bookToStash.volumeInfo.imageLinks?.thumbnail || "",
      },
      stashedAt: new Date().toISOString(),
    };

    stashBook({
      variables: {
        input,
      },
    })
      .then((response) => {
        if (response.data.stashBook.success) {
          // Handle success, show a success message or update state as needed
          console.log(
            "Book stashed successfully:",
            response.data.stashBook.message
          );
        } else {
          console.error(
            "Error stashing book:",
            response.data.stashBook.message
          );
        }
      })
      .catch((error) => {
        console.error("Error stashing book:", error);
      });
  };

  const toggleDescription = (index) => {
    const updatedSearchResults = [...searchResults];
    updatedSearchResults[index].truncateDescription =
      !updatedSearchResults[index].truncateDescription;
    setSearchResults(updatedSearchResults);
  };