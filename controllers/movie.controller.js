import dayjs from "dayjs";
import Movie from "../models/movie.model.js";
import cloudinaryUpload from "../utils/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";

export const createMovie = async (req, res) => {
  try {
    const { title, description, genre, releaseDate, duration, trailerUrl } =
      req.body;

    const parsedDate = dayjs(releaseDate, "DD-MM-YYYY");

    if (!parsedDate.isValid()) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format for release date field (DD-MM-YYYY)",
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a poster image",
      });
    }

    const poster = await cloudinaryUpload(req.file.buffer, "movie-app/posters");

    const movie = await Movie.create({
      title,
      description,
      genre: genre.split(",").map((g) => g.trim()), // in case genre is passed as stringified array
      releaseDate: parsedDate.toDate(),
      duration,
      trailerUrl,
      poster: {
        image_url: poster.image_url,
        image_id: poster.image_id,
      },
      admin_id: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Movie created successfully",
      data: movie,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Movie fetched successfully",
      data: movie,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getAllMovies = async (req, res) => {
  try {
    const { genre, search, page = 1, limit = 10 } = req.query;

    const query = { isActive: true };

    // If genre filter exists
    if (genre) {
      query.genre = { $in: genre.split(",") }; // comma-separated values
    }

    // If search keyword exists (searches title or description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Movie.countDocuments(query);

    return res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: movies,
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch movies",
      error: error.message,
    });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      genre,
      releaseDate,
      duration,
      trailerUrl,
      isActive,
    } = req.body;

    const movie = await Movie.findById(id);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing or malformed.",
      });
    }

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Only Admin can update the data
    if (req.user.id !== movie.admin_id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this movie",
      });
    }

    // Handle release date
    let parsedDate;
    if (releaseDate) {
      parsedDate = dayjs(releaseDate, "DD-MM-YYYY");
      if (!parsedDate.isValid()) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format for release date field (DD-MM-YYYY)",
        });
      }
    }

    // Handle poster update
    let updatedPoster = movie.poster;
    if (req.file) {
      // Delete old poster from Cloudinary
      await cloudinary.uploader.destroy(movie.poster.image_id);

      // upload new one
      const result = await cloudinaryUpload(
        req.file.buffer,
        "movie-app/posters"
      );

      updatedPoster = {
        image_url: result.image_url,
        image_id: result.image_id,
      };
    }

    movie.title = title || movie.title;
    movie.description = description || movie.description;
    movie.genre = genre ? genre.split(",") : movie.genre;
    movie.releaseDate = parsedDate ? parsedDate.toDate() : movie.releaseDate;
    movie.duration = duration || movie.duration;
    movie.trailerUrl = trailerUrl || movie.trailerUrl;
    movie.isActive = isActive === undefined ? movie.isActive : isActive;
    movie.poster = updatedPoster;

    await movie.save();

    return res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      data: movie,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Only Admin can delete the movie
    if (req.user.id !== movie.admin_id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this movie",
      });
    }
    // Delete poster from Cloudinary
    await cloudinary.uploader.destroy(movie.poster.image_id);

    await Movie.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
    });


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};