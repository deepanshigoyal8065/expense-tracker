import { Team } from '../models/Team.js'
import { User } from '../models/User.js'

// Create a new team (manager only)
export const createTeam = async (req, res, next) => {
  try {
    const { name, description, department } = req.body

    // Check if user is a manager
    if (req.user.role !== 'manager') {
      return res.status(403).json({ error: 'Only managers can create teams' })
    }

    if (!name || !department) {
      return res.status(400).json({ error: 'Name and department are required' })
    }

    const team = await Team.create({
      name,
      description,
      department,
      managerId: req.user._id,
      members: []
    })

    res.status(201).json(team)
  } catch (err) {
    next(err)
  }
}

// List all teams for the user
export const listTeams = async (req, res, next) => {
  try {
    // Find teams where user is manager or member
    const teams = await Team.find({
      $or: [
        { managerId: req.user._id },
        { 'members.userId': req.user._id }
      ],
      isActive: true
    })
      .populate('managerId', 'name email')
      .populate('members.userId', 'name email')
      .sort({ createdAt: -1 })

    res.json(teams)
  } catch (err) {
    next(err)
  }
}

// Get team details
export const getTeam = async (req, res, next) => {
  try {
    const { teamId } = req.params

    const team = await Team.findById(teamId)
      .populate('managerId', 'name email')
      .populate('members.userId', 'name email')

    if (!team) {
      return res.status(404).json({ error: 'Team not found' })
    }

    // Check if user is manager (compare _id directly)
    const isManager = team.managerId._id.toString() === req.user._id.toString()
    const isMember = team.members.some(m => m.userId._id.toString() === req.user._id.toString())

    if (!isManager && !isMember) {
      return res.status(403).json({ error: 'Access denied' })
    }

    res.json(team)
  } catch (err) {
    next(err)
  }
}

// Update team (manager only)
export const updateTeam = async (req, res, next) => {
  try {
    const { teamId } = req.params
    const { name, description, department } = req.body

    const team = await Team.findById(teamId)
    if (!team) {
      return res.status(404).json({ error: 'Team not found' })
    }

    // Check if user is the manager
    if (!team.isManager(req.user._id)) {
      return res.status(403).json({ error: 'Only team manager can update team' })
    }

    if (name) team.name = name
    if (description !== undefined) team.description = description
    if (department) team.department = department

    await team.save()
    await team.populate('managerId', 'name email')
    await team.populate('members.userId', 'name email')

    res.json(team)
  } catch (err) {
    next(err)
  }
}

// Delete team (manager only)
export const deleteTeam = async (req, res, next) => {
  try {
    const { teamId } = req.params

    const team = await Team.findById(teamId)
    if (!team) {
      return res.status(404).json({ error: 'Team not found' })
    }

    // Check if user is the manager
    if (!team.isManager(req.user._id)) {
      return res.status(403).json({ error: 'Only team manager can delete team' })
    }

    // Soft delete
    team.isActive = false
    await team.save()

    res.json({ message: 'Team deleted successfully' })
  } catch (err) {
    next(err)
  }
}

// Add member to team (manager only)
export const addMember = async (req, res, next) => {
  try {
    const { teamId } = req.params
    const { userId, role = 'member' } = req.body

    const team = await Team.findById(teamId)
    if (!team) {
      return res.status(404).json({ error: 'Team not found' })
    }

    // Check if user is the manager
    if (!team.isManager(req.user._id)) {
      return res.status(403).json({ error: 'Only team manager can add members' })
    }

    // Check if user exists
    const userToAdd = await User.findById(userId)
    if (!userToAdd) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Check if user is already a member
    if (team.isMember(userId)) {
      return res.status(400).json({ error: 'User is already a member' })
    }

    // Add member
    team.members.push({ userId, role })
    await team.save()
    await team.populate('members.userId', 'name email')

    res.json(team)
  } catch (err) {
    next(err)
  }
}

// Remove member from team (manager only)
export const removeMember = async (req, res, next) => {
  try {
    const { teamId, userId } = req.params

    const team = await Team.findById(teamId)
    if (!team) {
      return res.status(404).json({ error: 'Team not found' })
    }

    // Check if user is the manager
    if (!team.isManager(req.user._id)) {
      return res.status(403).json({ error: 'Only team manager can remove members' })
    }

    // Remove member
    team.members = team.members.filter(m => m.userId.toString() !== userId)
    await team.save()
    await team.populate('members.userId', 'name email')

    res.json(team)
  } catch (err) {
    next(err)
  }
}

// Update member role (manager only)
export const updateMemberRole = async (req, res, next) => {
  try {
    const { teamId, userId } = req.params
    const { role } = req.body

    if (!['member', 'viewer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' })
    }

    const team = await Team.findById(teamId)
    if (!team) {
      return res.status(404).json({ error: 'Team not found' })
    }

    // Check if user is the manager
    if (!team.isManager(req.user._id)) {
      return res.status(403).json({ error: 'Only team manager can update member roles' })
    }

    // Update member role
    const member = team.members.find(m => m.userId.toString() === userId)
    if (!member) {
      return res.status(404).json({ error: 'Member not found' })
    }

    member.role = role
    await team.save()
    await team.populate('members.userId', 'name email')

    res.json(team)
  } catch (err) {
    next(err)
  }
}
