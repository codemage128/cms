import mongoose from "mongoose";
const Schema = mongoose.Schema;

const settingsSchema = new Schema(
  {
    autoLogin: {
      type: Boolean,
      default: true
    },
    siteName: String,
    siteUrl: String,
    siteDescription: String,
    siteLogo: String,
    favicon: String,
    facebookCommentCode: String,
    socialMedia: {
      facebook: {
        type: String,
        trim: true
      },
      twitter: {
        type: String,
        trim: true
      },
      instagram: {
        type: String,
        trim: true
      },
      linkedin: {
        type: String,
        trim: true
      },
      youtube: {
        type: String,
        trim: true
      },
      pinterest: {
        type: String,
        trim: true
      }
    },
    adsense: String,
    contactInfo: {
      email: String,
      address: {
        type: String,
        trim: true
      },
      phoneNumber: {
        type: Array,
        trim: true
      },
      otherInfo: {
        type: String,
        trim: true
      }
    },
    textAsIcon: {
      type: Boolean,
      default: false
    },
    copyright: String,
    postPerPagination: Number,
    registrationSystem: {
      type: Boolean,
      default: true
    },
    commentSystem: {
      type: Boolean,
      default: true
    },
    approveComment: {
      type: Boolean,
      default: true
    },
    slider: {
      type: Boolean,
      default: true
    },
    emailVerification: {
      type: Boolean,
      default: false
    },
    sendWeeklyNewsletter: {
      type: Boolean,
      default: true
    },
    sendContactToEmail: {
      type: Boolean,
      default: false
    },
    emailForContact: {
      type: String,
      trim: true
    },
    facebookComment: {
      type: Boolean,
      default: true
    },
    emailVerification: {
      type: Boolean,
      default: true
    },
    facebookLogin: Boolean,
    twitterLogin: Boolean,
    googleLogin: Boolean,
    vkontakteLogin: Boolean,
    emojiReaction: Boolean,
    newsletter: Boolean,
    showPostAuthor: Boolean,
    showPostDate: Boolean,
    showPostViewCount: Boolean,
    approveAddedUserPost: Boolean,
    approveUpdatedUserPost: Boolean,
    htmlHeadCode: String,
    googleAnalyticsCode: String,
    installed: {
      option: {
        type: Boolean,
        default: false
      },
      code: String
    },
    email: {
      provider: {
        type: String,
        trim: true,
        enum: ["gmail", "sendgrid", "aws", "smtp"],
        default: "sendgrid"
      },
      config: {
        gmail: {
          username: {
            type: String,
            trim: true
          },
          clientId: {
            type: String,
            trim: true
          },
          clientSecret: {
            type: String,
            trim: true
          },
          refreshToken: {
            type: String,
            trim: true
          }
        },
        sendgrid: {
          username: {
            type: String,
            trim: true
          },
          password: {
            type: String,
            trim: true
          }
        },
        aws: {
          accessKeyId: {
            type: String,
            trim: true
          },
          secretAccessKey: {
            type: String,
            trim: true
          },
          region: {
            type: String,
            trim: true
          },
          email: {
            type: String,
            trim: true
          }
        },
        smtp: {
          host: {
            type: String,
            trim: true
          },
          port: {
            type: Number,
            trim: true
          },
          username: {
            type: String,
            trim: true
          },
          password: {
            type: String,
            trim: true
          },
          email: {
            type: String,
            trim: true
          }
        }
      }
    },
    media: {
      provider: {
        type: String,
        trim: true,
        enum: ["amazons3", "cloudinary", "local"],
        default: "local"
      },
      config: {
        amazons3: {
          accessKeyId: {
            type: String,
            trim: true
          },
          secretAccessKey: {
            type: String,
            trim: true
          },
          bucket: {
            type: String,
            trim: true
          }
        },
        cloudinary: {
          cloud_name: {
            type: String,
            trim: true
          },
          api_key: {
            type: String,
            trim: true
          },
          api_secret: {
            type: String,
            enum: true
          }
        }
      }
    },
    socialLogin: {
      facebook: {
        appId: {
          type: String,
          trim: true
        },
        appSecret: {
          type: String,
          trim: true
        }
      },
      google: {
        clientId: {
          type: String,
          trim: true
        },
        clientSecret: {
          type: String,
          trim: true
        }
      },
      twitter: {
        consumerKey: {
          type: String,
          trim: true
        },
        consumerSecret: {
          type: String,
          trim: true
        }
      },
      vkon: {
        clientId: {
          type: String,
          trim: true
        },
        clientSecret: {
          type: String,
          trim: true
        }
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
