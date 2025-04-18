import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

// Import your camt-parser npm library
import { parseCamt053 } from 'camt-parser';

export class Camt053Parser implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Camt053 Parser',
		name: 'camt053Parser',
		icon: 'fa:file-code',
		group: ['transform'],
		version: 1,
		description: 'Parse camt.053 XML messages to JSON',
		subtitle: 'Parse camt.053 XML',
		defaults: {
			name: 'Camt053 Parser',
			color: '#00b8b6',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'XML String',
				name: 'xml',
				type: 'string',
				default: '',
				description: 'The camt.053 XML string to parse',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const xml = this.getNodeParameter('xml', i) as string;
				if (!xml || typeof xml !== 'string') {
					throw new NodeOperationError(this.getNode(), 'Input XML is empty or invalid.');
				}
				const parsed = await parseCamt053(xml);
				if (Array.isArray(parsed)) {
					for (const statement of parsed) {
						returnData.push({ json: statement });
					}
				} else {
					returnData.push({ json: parsed });
				}
			} catch (error) {
				returnData.push({
					json: {
						error: error instanceof Error ? error.message : error,
						itemIndex: i,
					},
				});
			}
		}

		return [returnData];
	}
}
