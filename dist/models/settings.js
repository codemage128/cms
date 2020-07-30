"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _ref;

var Schema = _mongoose["default"].Schema;
var settingsSchema = new Schema((_ref = {
  autoLogin: {
    type: Boolean,
    "default": true
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
    "default": false
  },
  copyright: String,
  postPerPagination: Number,
  registrationSystem: {
    type: Boolean,
    "default": true
  },
  commentSystem: {
    type: Boolean,
    "default": true
  },
  approveComment: {
    type: Boolean,
    "default": true
  },
  slider: {
    type: Boolean,
    "default": true
  },
  emailVerification: {
    type: Boolean,
    "default": false
  },
  sendWeeklyNewsletter: {
    type: Boolean,
    "default": true
  },
  sendContactToEmail: {
    type: Boolean,
    "default": false
  },
  emailForContact: {
    type: String,
    trim: true
  },
  facebookComment: {
    type: Boolean,
    "default": true
  }
}, (0, _defineProperty2["default"])(_ref, "emailVerification", {
  type: Boolean,
  "default": true
}), (0, _defineProperty2["default"])(_ref, "facebookLogin", Boolean), (0, _defineProperty2["default"])(_ref, "twitterLogin", Boolean), (0, _defineProperty2["default"])(_ref, "googleLogin", Boolean), (0, _defineProperty2["default"])(_ref, "vkontakteLogin", Boolean), (0, _defineProperty2["default"])(_ref, "emojiReaction", Boolean), (0, _defineProperty2["default"])(_ref, "newsletter", Boolean), (0, _defineProperty2["default"])(_ref, "showPostAuthor", Boolean), (0, _defineProperty2["default"])(_ref, "showPostDate", Boolean), (0, _defineProperty2["default"])(_ref, "showPostViewCount", Boolean), (0, _defineProperty2["default"])(_ref, "approveAddedUserPost", Boolean), (0, _defineProperty2["default"])(_ref, "approveUpdatedUserPost", Boolean), (0, _defineProperty2["default"])(_ref, "htmlHeadCode", String), (0, _defineProperty2["default"])(_ref, "googleAnalyticsCode", String), (0, _defineProperty2["default"])(_ref, "installed", {
  option: {
    type: Boolean,
    "default": false
  },
  code: String
}), (0, _defineProperty2["default"])(_ref, "email", {
  provider: {
    type: String,
    trim: true,
    "enum": ["gmail", "sendgrid", "aws", "smtp"],
    "default": "sendgrid"
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
}), (0, _defineProperty2["default"])(_ref, "media", {
  provider: {
    type: String,
    trim: true,
    "enum": ["amazons3", "cloudinary", "local"],
    "default": "local"
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
        "enum": true
      }
    }
  }
}), (0, _defineProperty2["default"])(_ref, "socialLogin", {
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
}), _ref), {
  timestamps: true
});
module.exports = _mongoose["default"].model("Settings", settingsSchema);