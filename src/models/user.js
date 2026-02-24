const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    maxlength: 50,
  },
  lastName: {
    type: String,
    maxlength: 50,
  },
  emailId: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
    validate: {
      validator: (v) => {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 18,
  },
  gender: {
    type: String,
    enum: {
      values: ["M", "male", "Male", "F", "female", "Female", "Others"],
      message: `{VALUE} is not a valid gender`,
    },
  },
  photoUrl: {
    type: String,
    default:
      "data:image/webp;base64,UklGRvQDAABXRUJQVlA4IOgDAABwIQCdASq4ALQAPp1Kn0olpKMhrDT4cLATiWlu3WBpKT+tO8/rcrt7QPshlWRH+RMq2bhv3XfKEJyQhQF0fdHdz6jdHHwqTTNv6gd0sJCpScR+nWZF973w8L/3Yda0SvVQDXvQeO4WDtzYfBx492GmwSyhuRUTUW0/8VhRQWOcwXmj8ZXmF/xJuq7xfqbxanoRUx5Okm6mOXVQT24Ng/zupwIGdah3sEErpjVm2xIQqIUSFLbWJD36vPkR6f+Kr0kH6kgq5qyPfHVbI64qnBhJbF7NWQVcWycGKh7eVN3SQxMZOFCtEvc979m9IacHMa1kd+naUTeRERqKeOUifm/Z5UCkNnqkmbNjAsW1sVvSslffUAAA/vb6BRSHBccLuTdFfFOwExcQcPjFxL8sZ1CeyJkNZivMlQxpRDMoxa0UJPooHlO1bOdSQ7fKw44TIio4cT5NiU3gHEG3tHQRgL5rRRU4rxRQk9H4jUYyLGMDqUnewsVgOH6jmiicTJspR5fJRzgzAG1nkRce1bymNQDrA90wE2hgAr+qc1oSE5AI6T/NhtLMDh+iZE+3D+XGH830712eSqdVd6LkdBgu2YI7IVtPY/S+i/xaZJBdQGjLPMJui7Y6uU9LxWeXCShKCwYXnWBqXRS3/ouDv9WiU71nRCAtq0U55oemSAAjvcoALO5SSgfB2HVaAThPTgwfRf30CM/VUR5+kXO7U4WBzoFhD6A11p22l1en+Clm5IeKmRUV3tvPbnIFNevsOvLWSYE9oebQFW1K/cgwcpqNIFyxp/wewmhSUw5PPfstwUipMjfa1h7NNL8OlughWnxt1tBH5P1aq8NQVQdfc/93GUghGuSzI6HHq1oP+NxQrcXvczghnxxCIH2AqhCJW4n03rA1n8XUhHmYn3JdwCK/A9JCdHNvynFsW2gmCdY+oOvjGFCAeTlSN89qKllN33m32ZKVOcLR5E7oX4QbMM//OgLbGPo6w1XiQLdizYaAAduVrX04Wo+F/L9+RuSKkFAyjKlKrjEG4jI361/FLRR+DcfftUx9/I3aHVsbSbFu5bZ4wjzWY+h2ntdSn02L0IRo27gqE01PQkPP9aKj16gClAqg+Bkz1kiTH/iqkdUgisgNiyQ4k/hbHpjWumBZrAq7IbJuEj0+CQce6haESNRIvbYM7LlAkGftFS01h4/ijORMJfeuBpTKi2ATRCbywJZxuFEAmdhJ08MRFd7uOZk1DbJhrRgEd952N/bSSuUAjlkrIAuFwKqE/tKEVQ4Nw9pJxbmjsjSoUl7Y8V9irnFsaSadJ7R/hf3smLjECuhrbpjk8yl7g0AAAAAA",
  },
  about: {
    type: String,
    default: "This is a default description of the user!",
  },
  skills: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
