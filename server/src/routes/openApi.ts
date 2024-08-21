export const swaggerDocument = {
	openapi: "3.0.0",
	info: {
		title: "Package Delivery API",
		version: "1.0.0",
		description: "API for managing package deliveries.",
	},
	tags: [
		{
			name: "Package",
			description: "Operations related to packages",
		},
		{
			name: "Delivery",
			description: "Operations related to deliveries",
		},
	],
	paths: {
		"/api/package": {
			get: {
				tags: ["Package"],
				summary: "Get all packages",
				responses: {
					"200": {
						description: "A list of packages",
						content: {
							"application/json": {
								schema: {
									type: "array",
									items: {
										$ref: "#/components/schemas/PackageResponse",
									},
								},
							},
						},
					},
				},
			},
			post: {
				tags: ["Package"],
				summary: "Create a new package",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/PackageInput",
							},
						},
					},
				},
				responses: {
					"201": {
						description: "Package created successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/PackageResponse",
								},
							},
						},
					},
					"400": {
						description: "Invalid input",
					},
				},
			},
		},
		"/api/package/search": {
			get: {
				tags: ["Package"],
				summary: "Search for packages",
				parameters: [
					{
						name: "q",
						in: "query",
						required: false,
						schema: {
							type: "string",
						},
					},
					{
						name: "isOpen",
						in: "query",
						required: false,
						schema: {
							type: "boolean",
						},
					},
				],
				responses: {
					"200": {
						description: "Search results for packages",
						content: {
							"application/json": {
								schema: {
									type: "array",
									items: {
										$ref: "#/components/schemas/PackageResponse",
									},
								},
							},
						},
					},
					"400": {
						description: "Invalid search query",
					},
				},
			},
		},
		"/api/package/{id}": {
			get: {
				tags: ["Package"],
				summary: "Get package by ID",
				parameters: [
					{
						$ref: "#/components/parameters/PackageIdParam",
					},
				],
				responses: {
					"200": {
						description: "Package details",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/PackageResponse",
								},
							},
						},
					},
					"404": {
						description: "Package not found",
					},
				},
			},
			put: {
				tags: ["Package"],
				summary: "Update an existing package",
				parameters: [
					{
						$ref: "#/components/parameters/PackageIdParam",
					},
				],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/PackageUpdateInput",
							},
						},
					},
				},
				responses: {
					"200": {
						description: "Package updated successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/PackageResponse",
								},
							},
						},
					},
					"400": {
						description: "Invalid input",
					},
					"404": {
						description: "Package not found",
					},
				},
			},
			delete: {
				tags: ["Package"],
				summary: "Delete a package by ID",
				parameters: [
					{
						$ref: "#/components/parameters/PackageIdParam",
					},
				],
				responses: {
					"204": {
						description: "Package deleted successfully",
					},
					"404": {
						description: "Package not found",
					},
				},
			},
		},
		"/api/delivery": {
			get: {
				tags: ["Delivery"],
				summary: "Get all deliveries",
				responses: {
					"200": {
						description: "A list of deliveries",
						content: {
							"application/json": {
								schema: {
									type: "array",
									items: {
										$ref: "#/components/schemas/DeliveryResponse",
									},
								},
							},
						},
					},
				},
			},
			post: {
				tags: ["Delivery"],
				summary: "Create a new delivery",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/DeliveryInput",
							},
						},
					},
				},
				responses: {
					"201": {
						description: "Delivery created successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/DeliveryResponse",
								},
							},
						},
					},
					"400": {
						description: "Invalid input",
					},
				},
			},
		},
		"/api/delivery/{id}": {
			get: {
				tags: ["Delivery"],
				summary: "Get delivery by ID",
				parameters: [
					{
						$ref: "#/components/parameters/DeliveryIdParam",
					},
				],
				responses: {
					"200": {
						description: "Delivery details",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/DeliveryResponse",
								},
							},
						},
					},
					"404": {
						description: "Delivery not found",
					},
				},
			},
			put: {
				tags: ["Delivery"],
				summary: "Update an existing delivery",
				parameters: [
					{
						$ref: "#/components/parameters/DeliveryIdParam",
					},
				],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/DeliveryUpdateInput",
							},
						},
					},
				},
				responses: {
					"200": {
						description: "Delivery updated successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/DeliveryResponse",
								},
							},
						},
					},
					"400": {
						description: "Invalid input",
					},
					"404": {
						description: "Delivery not found",
					},
				},
			},
			delete: {
				tags: ["Delivery"],
				summary: "Delete a delivery by ID",
				parameters: [
					{
						$ref: "#/components/parameters/DeliveryIdParam",
					},
				],
				responses: {
					"204": {
						description: "Delivery deleted successfully",
					},
					"404": {
						description: "Delivery not found",
					},
				},
			},
		},
	},
	components: {
		schemas: {
			PackageBase: {
				type: "object",
				required: [
					"description",
					"weight",
					"width",
					"height",
					"depth",
					"from_name",
					"from_address",
					"from_location",
					"to_name",
					"to_address",
					"to_location",
				],
				properties: {
					description: {
						type: "string",
						description: "Description of the package",
						example: "Electronics",
					},
					weight: {
						type: "number",
						description: "Weight of the package in grams",
						example: 1500,
					},
					width: {
						type: "number",
						description: "Width of the package in centimeters",
						example: 30,
					},
					height: {
						type: "number",
						description: "Height of the package in centimeters",
						example: 10,
					},
					depth: {
						type: "number",
						description: "Depth of the package in centimeters",
						example: 20,
					},
					from_name: {
						type: "string",
						description: "Name of the sender",
						example: "John Doe",
					},
					from_address: {
						type: "string",
						description: "Address of the sender",
						example: "123 Main St, Anytown, USA",
					},
					from_location: {
						type: "object",
						properties: {
							lat: {
								type: "number",
								description:
									"Latitude of the sender's location",
								example: 37.7749,
							},
							lng: {
								type: "number",
								description:
									"Longitude of the sender's location",
								example: -122.4194,
							},
						},
					},
					to_name: {
						type: "string",
						description: "Name of the recipient",
						example: "Jane Smith",
					},
					to_address: {
						type: "string",
						description: "Address of the recipient",
						example: "456 Elm St, Anothertown, USA",
					},
					to_location: {
						type: "object",
						properties: {
							lat: {
								type: "number",
								description:
									"Latitude of the recipient's location",
								example: 40.7128,
							},
							lng: {
								type: "number",
								description:
									"Longitude of the recipient's location",
								example: -74.006,
							},
						},
					},
				},
			},
			PackageInput: {
				allOf: [
					{
						$ref: "#/components/schemas/PackageBase",
					},
					{
						type: "object",
					},
				],
			},
			PackageResponse: {
				type: "object",
				allOf: [
					{
						$ref: "#/components/schemas/PackageBase",
					},
					{
						type: "object",
						properties: {
							package_id: {
								type: "string",
								format: "uuid",
								description:
									"Unique identifier for the package",
							},
							active_delivery_id: {
								type: "string",
								format: "uuid",
								description:
									"Identifier of the active delivery",
							},
						},
						required: ["package_id", "active_delivery_id"],
					},
				],
			},
			PackageUpdateInput: {
				type: "object",
				allOf: [
					{
						$ref: "#/components/schemas/PackageBase",
					},
				],
				required: [],
			},
			DeliveryBase: {
				type: "object",
				properties: {
					pickup_time: {
						type: "string",
						format: "date-time",
						description: "The time when the package was picked up",
						example: "2024-08-21T12:00:00Z",
					},
					start_time: {
						type: "string",
						format: "date-time",
						description: "The time when the delivery started",
						example: "2024-08-21T13:00:00Z",
					},
					end_time: {
						type: "string",
						format: "date-time",
						description: "The time when the delivery ended",
						example: "2024-08-21T15:00:00Z",
					},
					location: {
						type: "object",
						properties: {
							lat: {
								type: "number",
								format: "float",
								description:
									"Latitude of the delivery's current location",
								example: 37.7749,
							},
							lng: {
								type: "number",
								format: "float",
								description:
									"Longitude of the delivery's current location",
								example: -122.4194,
							},
						},
						required: ["lat", "lng"],
						description: "Location of the delivery",
					},
					status: {
						type: "string",
						description: "Current status of the delivery",
						enum: [
							"open",
							"picked-up",
							"in-transit",
							"delivered",
							"failed",
						],
						example: "open",
					},
				},
				required: ["delivery_id", "package_id", "status"],
				example: {
					delivery_id: "123e4567-e89b-12d3-a456-426614174000",
					package_id: "123e4567-e89b-12d3-a456-426614174001",
					pickup_time: "2024-08-21T12:00:00Z",
					start_time: "2024-08-21T13:00:00Z",
					end_time: "2024-08-21T15:00:00Z",
					location: {
						lat: 37.7749,
						lng: -122.4194,
					},
					status: "in-transit",
				},
			},
			DeliveryInput: {
				type: "object",
				properties: {
					package_id: {
						type: "string",
						format: "uuid",
						description:
							"Unique identifier for the associated package",
						example: "123e4567-e89b-12d3-a456-426614174001",
					},
				},
				required: ["package_id"],
				example: {
					package_id: "123e4567-e89b-12d3-a456-426614174001",
				},
			},
			DeliveryResponse: {
				type: "object",
				allOf: [
					{
						$ref: "#/components/schemas/DeliveryBase",
					},
					{
						type: "object",
						properties: {
							delivery_id: {
								type: "string",
								format: "uuid",
								description:
									"Unique identifier for the delivery",
								example: "123e4567-e89b-12d3-a456-426614174000",
							},
							package_id: {
								type: "string",
								format: "uuid",
								description:
									"Unique identifier for the associated package",
								example: "123e4567-e89b-12d3-a456-426614174001",
							},
						},
						required: ["package_id", "delivery_id"],
					},
				],
				required: ["delivery_id", "package_id", "status"],
			},
			DeliveryUpdateInput: {
				type: "object",
				allOf: [
					{
						$ref: "#/components/schemas/DeliveryBase",
					},
				],
				required: [],
			},
			Error: {
				type: "object",
				properties: {
					message: {
						type: "string",
					},
					code: {
						type: "integer",
					},
				},
			},
		},
		responses: {
			NotFound: {
				description: "The requested resource was not found",
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/Error",
						},
					},
				},
			},
			BadRequest: {
				description:
					"The request was invalid or cannot be otherwise served",
			},
		},
		parameters: {
			PackageIdParam: {
				name: "id",
				in: "path",
				required: true,
				description: "The ID of the package",
				schema: {
					type: "string",
					format: "uuid",
				},
			},
			DeliveryIdParam: {
				name: "id",
				in: "path",
				required: true,
				description: "The ID of the delivery",
				schema: {
					type: "string",
					format: "uuid",
				},
			},
		},
	},
};
