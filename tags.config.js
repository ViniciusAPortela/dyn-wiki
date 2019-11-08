/**
 * A LIST OF TAGS ASSOCIATED TO USER CONFIGS
 */

/**
 * 'only64': {  <- the tag in Markdown file
 * 
 *      arch: [ <- the userSys Configuration  
 *              <- the user needs
 *     'x64'    <- to view what
 *     ...      <- are inside this tag 
 * 
 *   ]
 * }
 */

module.exports = {
    only64: {
        arch: [
            'x64',
            '64',
            'amd64'
        ],
    },

    only32: {
        arch: [
            'x86',
            '32',
            'i386'
        ],
    },

    onlyLinux: {
        os: [
            'linux'
        ]
    },

    onlyWindows: {
        os: [
            'linux'
        ]
    }

    //TODO: OTHER TAGS
}