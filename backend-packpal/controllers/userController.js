const User = require('../models/user');
const jwt = require('jsonwebtoken');
///////////////////////////////////////////
exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: 'User not found' });
  }};
///////////////////////////////////////////
exports.getOneUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, "secretcode");
    const _id = decodedToken._id;
    const user = await User.findOne({ _id: _id });
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: 'User not found' });
  }};
///////////////////////////////////////////
exports.createUser = async (req, res) => {
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
    });
    await user.save();
    res.status(201).json({ message: 'User saved successfully!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }};
///////////////////////////////////////////
exports.updateUser = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, "secretcode");
    const role = decodedToken.role;
    if (role === 'admin') {
      const updatedUser = {
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        name: req.body.name,
      };
      User.updateOne({ _id: req.params.id }, updatedUser)
        .then(() => res.status(200).json({ message: 'User updated successfully!' }))
        .catch(() => res.status(404).json({ message: 'User not found' }));
    } else {
      res.status(403).json({ message: 'You are not an admin' });
    }
};
///////////////////////////////////////////
exports.deleteUser = async (req, res) => {
  try{
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, "secretcode");
  const role = decodedToken.role;
  if (role === 'admin') {
    //console.log(role);
  await User.deleteOne({_id: req.params.id});
  res.status(201).json({ message: 'User deleted successfully!' });        
  } else {
    res.status(400).json({ message: 'User not found' });
  }
  }catch (error) {
    res.status(403).json({ message: 'You are not an admin' });
  }};
///////////////////////////////////////////