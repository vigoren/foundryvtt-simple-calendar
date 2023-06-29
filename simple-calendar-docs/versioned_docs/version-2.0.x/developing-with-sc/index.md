---
pagination_next: null
pagination_prev: null
---

# Developing With Simple Calendar

Simple Calendar offers a [rich API](api/namespaces/SimpleCalendar.md) to allow developers of systems, other modules and macros to easily add support for date and time functionality to their own projects!

The following instructions are meant for projects written in TypeScript as a way to access Simple Calendar types in your project. 

## Installation

You can install simple calendar from the [npm registry](https://www.npmjs.com/package/foundryvtt-simple-calendar).

To install the latest version run
```
npm install --save-dev foundryvtt-simple-calendar
```

To install a specific version of Simple Calendar you need to run
``` 
npm install --save-dev foundryvtt-simple-calendar@<version>
```

## Usage

Once the module is installed to access the type definitions in your project you will need to add it to the types section in the `tsconfig.json`.

```json
{
  "compilerOptions": {
    "types": ["foundryvtt-simple-calendar"]
  }
}
```

Once that is added you are ready to start developing!

## Documentation

The types definitions have documentation included with them but for more details on each of the options available in the API be sure to check out the [documentation site](api/namespaces/SimpleCalendar.md)!
