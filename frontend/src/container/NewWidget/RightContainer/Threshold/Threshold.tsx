import './Threshold.styles.scss';

import { CheckOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
	Card,
	Divider,
	Input,
	InputNumber,
	Select,
	Space,
	Typography,
} from 'antd';
import { PANEL_TYPES } from 'constants/queryBuilder';
import { useState } from 'react';

import { operatorOptions, showAsOptions, unitOptions } from '../constants';
import ColorSelector from './ColorSelector';
import CustomColor from './CustomColor';
import ShowCaseValue from './ShowCaseValue';
import { ThresholdProps } from './types';

function Threshold({
	index,
	thresholdOperator = '>',
	thresholdValue = 0,
	isEditEnabled = false,
	thresholdUnit = 'ms',
	thresholdColor = 'Red',
	thresholdFormat = 'Text',
	thresholdDeleteHandler,
	setThresholds,
	selectedGraph,
	thresholdLabel = '',
}: ThresholdProps): JSX.Element {
	const [isEditMode, setIsEditMode] = useState<boolean>(isEditEnabled);
	const [operator, setOperator] = useState<string | number>(
		thresholdOperator as string | number,
	);
	const [value, setValue] = useState<number>(thresholdValue);
	const [unit, setUnit] = useState<string>(thresholdUnit);
	const [color, setColor] = useState<string>(thresholdColor);
	const [format, setFormat] = useState<ThresholdProps['thresholdFormat']>(
		thresholdFormat,
	);
	const [label, setLabel] = useState<string>(thresholdLabel);

	const saveHandler = (): void => {
		setIsEditMode(false);
		if (setThresholds === undefined) {
			return;
		}
		setThresholds((prevThresholds) =>
			prevThresholds.map((threshold) => {
				if (threshold.index === index) {
					return {
						...threshold,
						isEditEnabled: false,
						thresholdColor: color,
						thresholdFormat: format,
						thresholdOperator: operator as ThresholdProps['thresholdOperator'],
						thresholdUnit: unit,
						thresholdValue: value,
						thresholdLabel: label,
					};
				}
				return threshold;
			}),
		);
	};

	const editHandler = (): void => {
		setIsEditMode(true);
	};

	const handleOperatorChange = (value: string | number): void => {
		setOperator(value);
	};

	const handleValueChange = (value: number | null): void => {
		if (value === null) {
			return;
		}
		setValue(value);
	};

	const handleUnitChange = (value: string): void => {
		setUnit(value);
	};

	const handlerFormatChange = (
		value: ThresholdProps['thresholdFormat'],
	): void => {
		setFormat(value);
	};

	const deleteHandler = (): void => {
		if (thresholdDeleteHandler) {
			thresholdDeleteHandler(index);
		}
	};

	const handleLabelChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	): void => {
		setLabel(event.target.value);
	};

	return (
		<div className="threahold-container">
			<Card className="threahold-card">
				<div className="threshold-card-container">
					<div className="threshold-action-button">
						{isEditMode ? (
							<CheckOutlined onClick={saveHandler} />
						) : (
							<EditOutlined className="threshold-action-icon" onClick={editHandler} />
						)}
						<Divider type="vertical" />
						<DeleteOutlined
							className="threshold-action-icon"
							onClick={deleteHandler}
						/>
					</div>
					<div>
						<Space>
							{selectedGraph === PANEL_TYPES.TIME_SERIES && (
								<>
									<Typography.Text>Label</Typography.Text>
									{isEditMode ? (
										<Input defaultValue={label} onChange={handleLabelChange} />
									) : (
										<ShowCaseValue width="180px" value={label} />
									)}
								</>
							)}
							{selectedGraph === PANEL_TYPES.VALUE && (
								<>
									<Typography.Text>If value is</Typography.Text>
									{isEditMode ? (
										<Select
											style={{ minWidth: '73px' }}
											defaultValue={operator}
											options={operatorOptions}
											onChange={handleOperatorChange}
										/>
									) : (
										<ShowCaseValue width="49px" value={operator} />
									)}
								</>
							)}
						</Space>
					</div>
					<div className="threshold-units-selector">
						<Space>
							{isEditMode ? (
								<InputNumber defaultValue={value} onChange={handleValueChange} />
							) : (
								<ShowCaseValue width="60px" value={value} />
							)}
							{isEditMode ? (
								<Select
									style={{ minWidth: '200px' }}
									defaultValue={unit}
									options={unitOptions}
									onChange={handleUnitChange}
								/>
							) : (
								<ShowCaseValue width="200px" value={unit} />
							)}
						</Space>
					</div>
					<div>
						<Space direction="vertical">
							<Typography.Text>Show with</Typography.Text>
							<Space>
								{isEditMode ? (
									<ColorSelector setColor={setColor} thresholdColor={color} />
								) : (
									<ShowCaseValue width="100px" value={<CustomColor color={color} />} />
								)}
								{isEditMode && selectedGraph === PANEL_TYPES.VALUE ? (
									<>
										<Select
											style={{ minWidth: '100px' }}
											defaultValue={format}
											options={showAsOptions}
											onChange={handlerFormatChange}
										/>
										<ShowCaseValue width="100px" value={format} />
									</>
								) : null}
							</Space>
						</Space>
					</div>
				</div>
			</Card>
		</div>
	);
}

Threshold.defaultProps = {
	thresholdOperator: undefined,
	thresholdValue: undefined,
	thresholdUnit: undefined,
	thresholdColor: undefined,
	thresholdFormat: undefined,
	thresholdLabel: undefined,
	isEditEnabled: false,
	thresholdDeleteHandler: undefined,
};

export default Threshold;