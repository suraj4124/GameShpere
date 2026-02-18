const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async.middleware');
const Game = require('../models/Game');
const JoinRequest = require('../models/JoinRequest');

// @desc    Get all games
// @route   GET /api/games
// @access  Public
exports.getGames = asyncHandler(async (req, res, next) => {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Game.find(JSON.parse(queryStr)).populate('organizer', 'name email').populate('players', 'name skillLevel sports');

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Game.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const games = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    res.status(200).json({
        success: true,
        count: games.length,
        pagination,
        data: games
    });
});

// @desc    Get single game
// @route   GET /api/games/:id
// @access  Public
exports.getGame = asyncHandler(async (req, res, next) => {
    const game = await Game.findById(req.params.id)
        .populate('organizer', 'name email')
        .populate('players', 'name skillLevel sports');

    if (!game) {
        return next(
            new ErrorResponse(`Game not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({ success: true, data: game });
});

// @desc    Create new game
// @route   POST /api/games
// @access  Private (Organizer)
exports.createGame = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.organizer = req.user.id;

    // Check for published game
    // logic can be added here

    const game = await Game.create(req.body);

    res.status(201).json({
        success: true,
        data: game
    });
});

// @desc    Update game
// @route   PUT /api/games/:id
// @access  Private (Organizer)
exports.updateGame = asyncHandler(async (req, res, next) => {
    let game = await Game.findById(req.params.id);

    if (!game) {
        return next(
            new ErrorResponse(`Game not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is game owner
    if (game.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update this game`,
                401
            )
        );
    }

    game = await Game.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: game });
});

// @desc    Delete game
// @route   DELETE /api/games/:id
// @access  Private (Organizer)
exports.deleteGame = asyncHandler(async (req, res, next) => {
    const game = await Game.findById(req.params.id);

    if (!game) {
        return next(
            new ErrorResponse(`Game not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is game owner
    if (game.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to delete this game`,
                401
            )
        );
    }

    await game.deleteOne();

    res.status(200).json({ success: true, data: {} });
});
