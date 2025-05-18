# Publishing to npm

This document describes the steps to publish the React-GSAP Animation Library to npm so that users can install it with `npm install react-gsap-animation-library`.

## Prerequisites

1. Create an npm account if you don't already have one at [npmjs.com](https://www.npmjs.com/signup)
2. Log in to npm from the command line:
   ```
   npm login
   ```

## Preparing for Publication

1. Ensure all your files are committed to Git
2. Make sure the `package.json` file has:
   - Correct version number (increment for new releases)
   - Appropriate description
   - Correct main/module/types entries
   - Required peer dependencies
   - Repository information
   - Your name or organization as author
   - Correct license

3. Run tests to make sure everything works:
   ```
   npm test
   ```

4. Build the library:
   ```
   npm run build
   ```

## Publishing

1. For the first publication:
   ```
   npm publish
   ```

2. For subsequent updates, first update the version number in `package.json` using semantic versioning:
   ```
   npm version patch  # For bug fixes
   npm version minor  # For new features
   npm version major  # For breaking changes
   ```

3. Then publish:
   ```
   npm publish
   ```

## Version Management

Follow semantic versioning:
- **Patch (1.0.x)**: Bug fixes and minor changes
- **Minor (1.x.0)**: New features, non-breaking changes
- **Major (x.0.0)**: Breaking changes

## Post-Publication

1. Create a new release/tag on GitHub
2. Update documentation if needed
3. Announce the release in appropriate channels

## Special Cases

### Scoped Packages

If you want to publish under a scope (e.g., @yourname/react-gsap-animation-library), modify the package name in `package.json`:
```
"name": "@yourname/react-gsap-animation-library"
```

And publish with:
```
npm publish --access public
```

### Beta/Alpha Releases

For beta releases, use:
```
npm version prerelease --preid=beta
npm publish --tag beta
```

Users can then install the beta version with:
```
npm install react-gsap-animation-library@beta
```

## Troubleshooting

### Name Already Taken

If the package name is already taken, you have a few options:
1. Choose a different name
2. Use a scoped package (e.g., @yourname/react-gsap-animation-library)
3. Contact the owner of the package if it seems abandoned

### Authentication Issues

If you encounter authentication issues:
1. Ensure you're logged in: `npm whoami`
2. Try logging out and in again: `npm logout` followed by `npm login`
3. Check if your npm token has expired

### Other Problems

For other issues, refer to the npm documentation or seek help in the npm community.