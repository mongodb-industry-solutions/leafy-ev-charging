import { GraphQLResolveInfo } from 'graphql';
import { GraphQLContext } from '../server/context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AddSessionFeedbackInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  rating: Scalars['Int']['input'];
  sessionId: Scalars['ID']['input'];
};

export type AddSessionFeedbackPayload = {
  __typename?: 'AddSessionFeedbackPayload';
  session: ChargingSession;
};

export type Address = {
  __typename?: 'Address';
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  postalCode?: Maybe<Scalars['String']['output']>;
  street?: Maybe<Scalars['String']['output']>;
};

export type AdminDashboard = {
  __typename?: 'AdminDashboard';
  pointAvailabilityBreakdown: Array<AdminDashboardBreakdownItem>;
  pointOperationalBreakdown: Array<AdminDashboardBreakdownItem>;
  recentIncidents: Array<AdminRecentIncident>;
  recentSessionTrend: Array<AdminDashboardTrendPoint>;
  recentSessions: Array<AdminRecentSession>;
  recentTelemetryTrend: Array<AdminTelemetryTrendPoint>;
  sessionStatusBreakdown: Array<AdminDashboardBreakdownItem>;
  summary: AdminDashboardSummary;
  topOperators: Array<AdminOperatorPerformance>;
};

export type AdminDashboardBreakdownItem = {
  __typename?: 'AdminDashboardBreakdownItem';
  label: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export type AdminDashboardSummary = {
  __typename?: 'AdminDashboardSummary';
  activeSessions: Scalars['Int']['output'];
  availableNowPoints: Scalars['Int']['output'];
  avgPriceCentsPerKwh: Scalars['Float']['output'];
  chargingPointsInUse: Scalars['Int']['output'];
  completedSessionsLast7Days: Scalars['Int']['output'];
  energyLast7DaysKwh: Scalars['Float']['output'];
  openIncidents: Scalars['Int']['output'];
  operationalPoints: Scalars['Int']['output'];
  outOfServicePoints: Scalars['Int']['output'];
  reservedPoints: Scalars['Int']['output'];
  revenueLast7DaysCents: Scalars['Int']['output'];
  totalChargingPoints: Scalars['Int']['output'];
  totalStations: Scalars['Int']['output'];
};

export type AdminDashboardTrendPoint = {
  __typename?: 'AdminDashboardTrendPoint';
  bucket: Scalars['String']['output'];
  completedSessions: Scalars['Int']['output'];
  energyKwh: Scalars['Float']['output'];
  revenueCents: Scalars['Int']['output'];
  sessions: Scalars['Int']['output'];
};

export type AdminOperatorPerformance = {
  __typename?: 'AdminOperatorPerformance';
  availableNowPoints: Scalars['Int']['output'];
  avgPriceCentsPerKwh: Scalars['Float']['output'];
  chargingPoints: Scalars['Int']['output'];
  operator: Scalars['String']['output'];
  stations: Scalars['Int']['output'];
  utilizationPercent: Scalars['Float']['output'];
};

export type AdminRecentIncident = {
  __typename?: 'AdminRecentIncident';
  chargingPointLabel?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  severity: IncidentSeverity;
  stationName?: Maybe<Scalars['String']['output']>;
  status: IncidentStatus;
  type: IncidentType;
};

export type AdminRecentSession = {
  __typename?: 'AdminRecentSession';
  chargingPointLabel: Scalars['String']['output'];
  endedAt?: Maybe<Scalars['String']['output']>;
  energyDeliveredKwh?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  startedAt?: Maybe<Scalars['String']['output']>;
  stationName: Scalars['String']['output'];
  status: SessionStatus;
  totalCents?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['String']['output'];
  vehicleLabel: Scalars['String']['output'];
};

export type AdminTelemetryTrendPoint = {
  __typename?: 'AdminTelemetryTrendPoint';
  avgPowerKw: Scalars['Float']['output'];
  bucket: Scalars['String']['output'];
  energyDeltaKwh: Scalars['Float']['output'];
  maxPowerKw: Scalars['Float']['output'];
  sampleCount: Scalars['Int']['output'];
};

export type BoundsInput = {
  maxLat: Scalars['Float']['input'];
  maxLng: Scalars['Float']['input'];
  minLat: Scalars['Float']['input'];
  minLng: Scalars['Float']['input'];
};

export type CancelChargingSessionInput = {
  reason?: InputMaybe<Scalars['String']['input']>;
  sessionId: Scalars['ID']['input'];
};

export type CancelChargingSessionPayload = {
  __typename?: 'CancelChargingSessionPayload';
  session: ChargingSession;
};

export type ChargingDetails = {
  __typename?: 'ChargingDetails';
  connectorUsed?: Maybe<SessionConnectorUsed>;
  endedAt?: Maybe<Scalars['String']['output']>;
  energyDeliveredKwh?: Maybe<Scalars['Float']['output']>;
  meterStartKwh?: Maybe<Scalars['Float']['output']>;
  meterStopKwh?: Maybe<Scalars['Float']['output']>;
  socStartPercent?: Maybe<Scalars['Float']['output']>;
  socStopPercent?: Maybe<Scalars['Float']['output']>;
  startedAt?: Maybe<Scalars['String']['output']>;
};

export type ChargingPointInfo = {
  __typename?: 'ChargingPointInfo';
  availableNow: Scalars['Boolean']['output'];
  connectors: Array<ConnectorInfo>;
  id: Scalars['ID']['output'];
  outOfService: Scalars['Boolean']['output'];
};

export type ChargingSession = {
  __typename?: 'ChargingSession';
  booking: SessionBooking;
  charging: ChargingDetails;
  chargingPointId: Scalars['ID']['output'];
  cost: SessionCost;
  createdAt: Scalars['String']['output'];
  feedback?: Maybe<SessionFeedback>;
  id: Scalars['ID']['output'];
  pricingSnapshot: PricingSnapshot;
  stationId: Scalars['ID']['output'];
  stationSnapshot: StationSnapshot;
  status: SessionStatus;
  updatedAt: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
  vehicleId: Scalars['ID']['output'];
  vehicleSnapshot: VehicleSnapshot;
};

export type ChargingStation = {
  __typename?: 'ChargingStation';
  address?: Maybe<Address>;
  availability: StationAvailability;
  chargingPoints: Array<ChargingPointInfo>;
  connectorTypes: Array<ConnectorType>;
  hasFastCharging: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  location: GeoPoint;
  maxPowerKw: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  operator: Scalars['String']['output'];
  priceCentsPerKwh: Scalars['Int']['output'];
  stationCode: Scalars['String']['output'];
};

export type ChargingStationFacets = {
  __typename?: 'ChargingStationFacets';
  availableNowCount: Scalars['Int']['output'];
  connectorTypes: Array<ConnectorFacet>;
  powerRange: NumericRange;
  priceRange: NumericRange;
};

export type ChargingStationFiltersInput = {
  availableNow?: InputMaybe<Scalars['Boolean']['input']>;
  connectorTypes?: InputMaybe<Array<ConnectorType>>;
  fastCharging?: InputMaybe<Scalars['Boolean']['input']>;
  maxPowerKw?: InputMaybe<Scalars['Float']['input']>;
  maxPriceCentsPerKwh?: InputMaybe<Scalars['Int']['input']>;
  minPowerKw?: InputMaybe<Scalars['Float']['input']>;
  minPriceCentsPerKwh?: InputMaybe<Scalars['Int']['input']>;
  tethered?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CompleteChargingSessionInput = {
  sessionId: Scalars['ID']['input'];
};

export type CompleteChargingSessionPayload = {
  __typename?: 'CompleteChargingSessionPayload';
  session: ChargingSession;
};

export type ConnectorFacet = {
  __typename?: 'ConnectorFacet';
  count: Scalars['Int']['output'];
  type: ConnectorType;
};

export type ConnectorInfo = {
  __typename?: 'ConnectorInfo';
  powerKw: Scalars['Float']['output'];
  tethered?: Maybe<Scalars['Boolean']['output']>;
  type: ConnectorType;
};

export enum ConnectorType {
  Ccs = 'CCS',
  ChAdeMo = 'CHAdeMO',
  Schuko = 'SCHUKO',
  Type1 = 'TYPE1',
  Type2 = 'TYPE2'
}

export type GeoPoint = {
  __typename?: 'GeoPoint';
  lat: Scalars['Float']['output'];
  lng: Scalars['Float']['output'];
};

export type IdleFee = {
  __typename?: 'IdleFee';
  afterMinutes: Scalars['Int']['output'];
  priceCentsPerMinute: Scalars['Int']['output'];
};

export enum IncidentSeverity {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

export enum IncidentStatus {
  Acknowledged = 'ACKNOWLEDGED',
  Open = 'OPEN',
  Resolved = 'RESOLVED'
}

export enum IncidentType {
  ConnectorFault = 'CONNECTOR_FAULT',
  Maintenance = 'MAINTENANCE',
  NoHeartbeat = 'NO_HEARTBEAT',
  PowerDerate = 'POWER_DERATE',
  UserReport = 'USER_REPORT'
}

export type MapItem = ChargingStation | StationCluster;

export type Mutation = {
  __typename?: 'Mutation';
  addSessionFeedback: AddSessionFeedbackPayload;
  cancelChargingSession: CancelChargingSessionPayload;
  completeChargingSession: CompleteChargingSessionPayload;
  reportSessionIncident: ReportSessionIncidentPayload;
  reserveChargingPoint: ReserveChargingPointPayload;
  startChargingSession: StartChargingSessionPayload;
};


export type MutationAddSessionFeedbackArgs = {
  input: AddSessionFeedbackInput;
};


export type MutationCancelChargingSessionArgs = {
  input: CancelChargingSessionInput;
};


export type MutationCompleteChargingSessionArgs = {
  input: CompleteChargingSessionInput;
};


export type MutationReportSessionIncidentArgs = {
  input: ReportSessionIncidentInput;
};


export type MutationReserveChargingPointArgs = {
  input: ReserveChargingPointInput;
};


export type MutationStartChargingSessionArgs = {
  input: StartChargingSessionInput;
};

export type NumericRange = {
  __typename?: 'NumericRange';
  max: Scalars['Float']['output'];
  min: Scalars['Float']['output'];
};

export type PricingSnapshot = {
  __typename?: 'PricingSnapshot';
  currency: Scalars['String']['output'];
  idleFee?: Maybe<IdleFee>;
  priceCentsPerKwh: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  adminDashboard: AdminDashboard;
  chargingSessions: SessionConnection;
  chargingStationFacets: ChargingStationFacets;
  chargingStationsInBounds: Array<MapItem>;
  users: Array<User>;
  vehicles: Array<Vehicle>;
};


export type QueryChargingSessionsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  fromDate?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['ID']['input'];
};


export type QueryChargingStationsInBoundsArgs = {
  bounds: BoundsInput;
  filters?: InputMaybe<ChargingStationFiltersInput>;
  zoom: Scalars['Int']['input'];
};


export type QueryVehiclesArgs = {
  userId: Scalars['ID']['input'];
};

export type ReportSessionIncidentInput = {
  description: Scalars['String']['input'];
  sessionId: Scalars['ID']['input'];
  severity: IncidentSeverity;
};

export type ReportSessionIncidentPayload = {
  __typename?: 'ReportSessionIncidentPayload';
  incidentId: Scalars['ID']['output'];
};

export type ReserveChargingPointInput = {
  chargingPointId: Scalars['ID']['input'];
  stationId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
  vehicleId: Scalars['ID']['input'];
};

export type ReserveChargingPointPayload = {
  __typename?: 'ReserveChargingPointPayload';
  session: ChargingSession;
};

export type SessionBooking = {
  __typename?: 'SessionBooking';
  bookedAt: Scalars['String']['output'];
  cancelReason?: Maybe<Scalars['String']['output']>;
  canceledAt?: Maybe<Scalars['String']['output']>;
  expiresAt: Scalars['String']['output'];
};

export type SessionConnection = {
  __typename?: 'SessionConnection';
  edges: Array<ChargingSession>;
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
};

export type SessionConnectorUsed = {
  __typename?: 'SessionConnectorUsed';
  power?: Maybe<Scalars['Float']['output']>;
  tethered?: Maybe<Scalars['Boolean']['output']>;
  type?: Maybe<ConnectorType>;
};

export type SessionCost = {
  __typename?: 'SessionCost';
  energyCents?: Maybe<Scalars['Int']['output']>;
  idleCents?: Maybe<Scalars['Int']['output']>;
  totalCents?: Maybe<Scalars['Int']['output']>;
};

export type SessionFeedback = {
  __typename?: 'SessionFeedback';
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  rating: Scalars['Int']['output'];
};

export enum SessionStatus {
  Active = 'ACTIVE',
  Booked = 'BOOKED',
  Canceled = 'CANCELED',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  NoShow = 'NO_SHOW'
}

export type StartChargingSessionInput = {
  sessionId: Scalars['ID']['input'];
};

export type StartChargingSessionPayload = {
  __typename?: 'StartChargingSessionPayload';
  session: ChargingSession;
};

export type StationAvailability = {
  __typename?: 'StationAvailability';
  availableNowPoints: Scalars['Int']['output'];
  operationalPoints: Scalars['Int']['output'];
  totalPoints: Scalars['Int']['output'];
};

export type StationCluster = {
  __typename?: 'StationCluster';
  count: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  location: GeoPoint;
};

export type StationSnapshot = {
  __typename?: 'StationSnapshot';
  addressShort: Scalars['String']['output'];
  chargingPointLabel: Scalars['String']['output'];
  location: GeoPoint;
  name: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  displayName: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  roles: Array<UserRole>;
};

export enum UserRole {
  Admin = 'ADMIN',
  User = 'USER'
}

export type Vehicle = {
  __typename?: 'Vehicle';
  batteryCapacityKwh: Scalars['Float']['output'];
  connectorTypes: Array<ConnectorType>;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  make: Scalars['String']['output'];
  maxChargePowerKw: Scalars['Float']['output'];
  model: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
  vin: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type VehicleSnapshot = {
  __typename?: 'VehicleSnapshot';
  make: Scalars['String']['output'];
  model: Scalars['String']['output'];
  vinLast6: Scalars['String']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = {
  MapItem:
    | ( ChargingStation )
    | ( StationCluster )
  ;
};


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AddSessionFeedbackInput: AddSessionFeedbackInput;
  AddSessionFeedbackPayload: ResolverTypeWrapper<AddSessionFeedbackPayload>;
  Address: ResolverTypeWrapper<Address>;
  AdminDashboard: ResolverTypeWrapper<AdminDashboard>;
  AdminDashboardBreakdownItem: ResolverTypeWrapper<AdminDashboardBreakdownItem>;
  AdminDashboardSummary: ResolverTypeWrapper<AdminDashboardSummary>;
  AdminDashboardTrendPoint: ResolverTypeWrapper<AdminDashboardTrendPoint>;
  AdminOperatorPerformance: ResolverTypeWrapper<AdminOperatorPerformance>;
  AdminRecentIncident: ResolverTypeWrapper<AdminRecentIncident>;
  AdminRecentSession: ResolverTypeWrapper<AdminRecentSession>;
  AdminTelemetryTrendPoint: ResolverTypeWrapper<AdminTelemetryTrendPoint>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  BoundsInput: BoundsInput;
  CancelChargingSessionInput: CancelChargingSessionInput;
  CancelChargingSessionPayload: ResolverTypeWrapper<CancelChargingSessionPayload>;
  ChargingDetails: ResolverTypeWrapper<ChargingDetails>;
  ChargingPointInfo: ResolverTypeWrapper<ChargingPointInfo>;
  ChargingSession: ResolverTypeWrapper<ChargingSession>;
  ChargingStation: ResolverTypeWrapper<ChargingStation>;
  ChargingStationFacets: ResolverTypeWrapper<ChargingStationFacets>;
  ChargingStationFiltersInput: ChargingStationFiltersInput;
  CompleteChargingSessionInput: CompleteChargingSessionInput;
  CompleteChargingSessionPayload: ResolverTypeWrapper<CompleteChargingSessionPayload>;
  ConnectorFacet: ResolverTypeWrapper<ConnectorFacet>;
  ConnectorInfo: ResolverTypeWrapper<ConnectorInfo>;
  ConnectorType: ConnectorType;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  GeoPoint: ResolverTypeWrapper<GeoPoint>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  IdleFee: ResolverTypeWrapper<IdleFee>;
  IncidentSeverity: IncidentSeverity;
  IncidentStatus: IncidentStatus;
  IncidentType: IncidentType;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  MapItem: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['MapItem']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  NumericRange: ResolverTypeWrapper<NumericRange>;
  PricingSnapshot: ResolverTypeWrapper<PricingSnapshot>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  ReportSessionIncidentInput: ReportSessionIncidentInput;
  ReportSessionIncidentPayload: ResolverTypeWrapper<ReportSessionIncidentPayload>;
  ReserveChargingPointInput: ReserveChargingPointInput;
  ReserveChargingPointPayload: ResolverTypeWrapper<ReserveChargingPointPayload>;
  SessionBooking: ResolverTypeWrapper<SessionBooking>;
  SessionConnection: ResolverTypeWrapper<SessionConnection>;
  SessionConnectorUsed: ResolverTypeWrapper<SessionConnectorUsed>;
  SessionCost: ResolverTypeWrapper<SessionCost>;
  SessionFeedback: ResolverTypeWrapper<SessionFeedback>;
  SessionStatus: SessionStatus;
  StartChargingSessionInput: StartChargingSessionInput;
  StartChargingSessionPayload: ResolverTypeWrapper<StartChargingSessionPayload>;
  StationAvailability: ResolverTypeWrapper<StationAvailability>;
  StationCluster: ResolverTypeWrapper<StationCluster>;
  StationSnapshot: ResolverTypeWrapper<StationSnapshot>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  User: ResolverTypeWrapper<User>;
  UserRole: UserRole;
  Vehicle: ResolverTypeWrapper<Vehicle>;
  VehicleSnapshot: ResolverTypeWrapper<VehicleSnapshot>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AddSessionFeedbackInput: AddSessionFeedbackInput;
  AddSessionFeedbackPayload: AddSessionFeedbackPayload;
  Address: Address;
  AdminDashboard: AdminDashboard;
  AdminDashboardBreakdownItem: AdminDashboardBreakdownItem;
  AdminDashboardSummary: AdminDashboardSummary;
  AdminDashboardTrendPoint: AdminDashboardTrendPoint;
  AdminOperatorPerformance: AdminOperatorPerformance;
  AdminRecentIncident: AdminRecentIncident;
  AdminRecentSession: AdminRecentSession;
  AdminTelemetryTrendPoint: AdminTelemetryTrendPoint;
  Boolean: Scalars['Boolean']['output'];
  BoundsInput: BoundsInput;
  CancelChargingSessionInput: CancelChargingSessionInput;
  CancelChargingSessionPayload: CancelChargingSessionPayload;
  ChargingDetails: ChargingDetails;
  ChargingPointInfo: ChargingPointInfo;
  ChargingSession: ChargingSession;
  ChargingStation: ChargingStation;
  ChargingStationFacets: ChargingStationFacets;
  ChargingStationFiltersInput: ChargingStationFiltersInput;
  CompleteChargingSessionInput: CompleteChargingSessionInput;
  CompleteChargingSessionPayload: CompleteChargingSessionPayload;
  ConnectorFacet: ConnectorFacet;
  ConnectorInfo: ConnectorInfo;
  Float: Scalars['Float']['output'];
  GeoPoint: GeoPoint;
  ID: Scalars['ID']['output'];
  IdleFee: IdleFee;
  Int: Scalars['Int']['output'];
  MapItem: ResolversUnionTypes<ResolversParentTypes>['MapItem'];
  Mutation: Record<PropertyKey, never>;
  NumericRange: NumericRange;
  PricingSnapshot: PricingSnapshot;
  Query: Record<PropertyKey, never>;
  ReportSessionIncidentInput: ReportSessionIncidentInput;
  ReportSessionIncidentPayload: ReportSessionIncidentPayload;
  ReserveChargingPointInput: ReserveChargingPointInput;
  ReserveChargingPointPayload: ReserveChargingPointPayload;
  SessionBooking: SessionBooking;
  SessionConnection: SessionConnection;
  SessionConnectorUsed: SessionConnectorUsed;
  SessionCost: SessionCost;
  SessionFeedback: SessionFeedback;
  StartChargingSessionInput: StartChargingSessionInput;
  StartChargingSessionPayload: StartChargingSessionPayload;
  StationAvailability: StationAvailability;
  StationCluster: StationCluster;
  StationSnapshot: StationSnapshot;
  String: Scalars['String']['output'];
  User: User;
  Vehicle: Vehicle;
  VehicleSnapshot: VehicleSnapshot;
};

export type AddSessionFeedbackPayloadResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AddSessionFeedbackPayload'] = ResolversParentTypes['AddSessionFeedbackPayload']> = {
  session?: Resolver<ResolversTypes['ChargingSession'], ParentType, ContextType>;
};

export type AddressResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = {
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  postalCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  street?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type AdminDashboardResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AdminDashboard'] = ResolversParentTypes['AdminDashboard']> = {
  pointAvailabilityBreakdown?: Resolver<Array<ResolversTypes['AdminDashboardBreakdownItem']>, ParentType, ContextType>;
  pointOperationalBreakdown?: Resolver<Array<ResolversTypes['AdminDashboardBreakdownItem']>, ParentType, ContextType>;
  recentIncidents?: Resolver<Array<ResolversTypes['AdminRecentIncident']>, ParentType, ContextType>;
  recentSessionTrend?: Resolver<Array<ResolversTypes['AdminDashboardTrendPoint']>, ParentType, ContextType>;
  recentSessions?: Resolver<Array<ResolversTypes['AdminRecentSession']>, ParentType, ContextType>;
  recentTelemetryTrend?: Resolver<Array<ResolversTypes['AdminTelemetryTrendPoint']>, ParentType, ContextType>;
  sessionStatusBreakdown?: Resolver<Array<ResolversTypes['AdminDashboardBreakdownItem']>, ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['AdminDashboardSummary'], ParentType, ContextType>;
  topOperators?: Resolver<Array<ResolversTypes['AdminOperatorPerformance']>, ParentType, ContextType>;
};

export type AdminDashboardBreakdownItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AdminDashboardBreakdownItem'] = ResolversParentTypes['AdminDashboardBreakdownItem']> = {
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type AdminDashboardSummaryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AdminDashboardSummary'] = ResolversParentTypes['AdminDashboardSummary']> = {
  activeSessions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  availableNowPoints?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  avgPriceCentsPerKwh?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  chargingPointsInUse?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  completedSessionsLast7Days?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  energyLast7DaysKwh?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  openIncidents?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  operationalPoints?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  outOfServicePoints?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  reservedPoints?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revenueLast7DaysCents?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalChargingPoints?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalStations?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type AdminDashboardTrendPointResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AdminDashboardTrendPoint'] = ResolversParentTypes['AdminDashboardTrendPoint']> = {
  bucket?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  completedSessions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  energyKwh?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  revenueCents?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  sessions?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type AdminOperatorPerformanceResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AdminOperatorPerformance'] = ResolversParentTypes['AdminOperatorPerformance']> = {
  availableNowPoints?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  avgPriceCentsPerKwh?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  chargingPoints?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  operator?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stations?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  utilizationPercent?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type AdminRecentIncidentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AdminRecentIncident'] = ResolversParentTypes['AdminRecentIncident']> = {
  chargingPointLabel?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  severity?: Resolver<ResolversTypes['IncidentSeverity'], ParentType, ContextType>;
  stationName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['IncidentStatus'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['IncidentType'], ParentType, ContextType>;
};

export type AdminRecentSessionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AdminRecentSession'] = ResolversParentTypes['AdminRecentSession']> = {
  chargingPointLabel?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  endedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  energyDeliveredKwh?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stationName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['SessionStatus'], ParentType, ContextType>;
  totalCents?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vehicleLabel?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type AdminTelemetryTrendPointResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AdminTelemetryTrendPoint'] = ResolversParentTypes['AdminTelemetryTrendPoint']> = {
  avgPowerKw?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  bucket?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  energyDeltaKwh?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  maxPowerKw?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  sampleCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type CancelChargingSessionPayloadResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CancelChargingSessionPayload'] = ResolversParentTypes['CancelChargingSessionPayload']> = {
  session?: Resolver<ResolversTypes['ChargingSession'], ParentType, ContextType>;
};

export type ChargingDetailsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ChargingDetails'] = ResolversParentTypes['ChargingDetails']> = {
  connectorUsed?: Resolver<Maybe<ResolversTypes['SessionConnectorUsed']>, ParentType, ContextType>;
  endedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  energyDeliveredKwh?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  meterStartKwh?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  meterStopKwh?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  socStartPercent?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  socStopPercent?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type ChargingPointInfoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ChargingPointInfo'] = ResolversParentTypes['ChargingPointInfo']> = {
  availableNow?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  connectors?: Resolver<Array<ResolversTypes['ConnectorInfo']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  outOfService?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type ChargingSessionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ChargingSession'] = ResolversParentTypes['ChargingSession']> = {
  booking?: Resolver<ResolversTypes['SessionBooking'], ParentType, ContextType>;
  charging?: Resolver<ResolversTypes['ChargingDetails'], ParentType, ContextType>;
  chargingPointId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cost?: Resolver<ResolversTypes['SessionCost'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  feedback?: Resolver<Maybe<ResolversTypes['SessionFeedback']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  pricingSnapshot?: Resolver<ResolversTypes['PricingSnapshot'], ParentType, ContextType>;
  stationId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  stationSnapshot?: Resolver<ResolversTypes['StationSnapshot'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['SessionStatus'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  vehicleId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  vehicleSnapshot?: Resolver<ResolversTypes['VehicleSnapshot'], ParentType, ContextType>;
};

export type ChargingStationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ChargingStation'] = ResolversParentTypes['ChargingStation']> = {
  address?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>;
  availability?: Resolver<ResolversTypes['StationAvailability'], ParentType, ContextType>;
  chargingPoints?: Resolver<Array<ResolversTypes['ChargingPointInfo']>, ParentType, ContextType>;
  connectorTypes?: Resolver<Array<ResolversTypes['ConnectorType']>, ParentType, ContextType>;
  hasFastCharging?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  location?: Resolver<ResolversTypes['GeoPoint'], ParentType, ContextType>;
  maxPowerKw?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  operator?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  priceCentsPerKwh?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  stationCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChargingStationFacetsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ChargingStationFacets'] = ResolversParentTypes['ChargingStationFacets']> = {
  availableNowCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  connectorTypes?: Resolver<Array<ResolversTypes['ConnectorFacet']>, ParentType, ContextType>;
  powerRange?: Resolver<ResolversTypes['NumericRange'], ParentType, ContextType>;
  priceRange?: Resolver<ResolversTypes['NumericRange'], ParentType, ContextType>;
};

export type CompleteChargingSessionPayloadResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CompleteChargingSessionPayload'] = ResolversParentTypes['CompleteChargingSessionPayload']> = {
  session?: Resolver<ResolversTypes['ChargingSession'], ParentType, ContextType>;
};

export type ConnectorFacetResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ConnectorFacet'] = ResolversParentTypes['ConnectorFacet']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ConnectorType'], ParentType, ContextType>;
};

export type ConnectorInfoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ConnectorInfo'] = ResolversParentTypes['ConnectorInfo']> = {
  powerKw?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  tethered?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ConnectorType'], ParentType, ContextType>;
};

export type GeoPointResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GeoPoint'] = ResolversParentTypes['GeoPoint']> = {
  lat?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  lng?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type IdleFeeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['IdleFee'] = ResolversParentTypes['IdleFee']> = {
  afterMinutes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  priceCentsPerMinute?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type MapItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['MapItem'] = ResolversParentTypes['MapItem']> = {
  __resolveType: TypeResolveFn<'ChargingStation' | 'StationCluster', ParentType, ContextType>;
};

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addSessionFeedback?: Resolver<ResolversTypes['AddSessionFeedbackPayload'], ParentType, ContextType, RequireFields<MutationAddSessionFeedbackArgs, 'input'>>;
  cancelChargingSession?: Resolver<ResolversTypes['CancelChargingSessionPayload'], ParentType, ContextType, RequireFields<MutationCancelChargingSessionArgs, 'input'>>;
  completeChargingSession?: Resolver<ResolversTypes['CompleteChargingSessionPayload'], ParentType, ContextType, RequireFields<MutationCompleteChargingSessionArgs, 'input'>>;
  reportSessionIncident?: Resolver<ResolversTypes['ReportSessionIncidentPayload'], ParentType, ContextType, RequireFields<MutationReportSessionIncidentArgs, 'input'>>;
  reserveChargingPoint?: Resolver<ResolversTypes['ReserveChargingPointPayload'], ParentType, ContextType, RequireFields<MutationReserveChargingPointArgs, 'input'>>;
  startChargingSession?: Resolver<ResolversTypes['StartChargingSessionPayload'], ParentType, ContextType, RequireFields<MutationStartChargingSessionArgs, 'input'>>;
};

export type NumericRangeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['NumericRange'] = ResolversParentTypes['NumericRange']> = {
  max?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  min?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type PricingSnapshotResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PricingSnapshot'] = ResolversParentTypes['PricingSnapshot']> = {
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  idleFee?: Resolver<Maybe<ResolversTypes['IdleFee']>, ParentType, ContextType>;
  priceCentsPerKwh?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  adminDashboard?: Resolver<ResolversTypes['AdminDashboard'], ParentType, ContextType>;
  chargingSessions?: Resolver<ResolversTypes['SessionConnection'], ParentType, ContextType, RequireFields<QueryChargingSessionsArgs, 'userId'>>;
  chargingStationFacets?: Resolver<ResolversTypes['ChargingStationFacets'], ParentType, ContextType>;
  chargingStationsInBounds?: Resolver<Array<ResolversTypes['MapItem']>, ParentType, ContextType, RequireFields<QueryChargingStationsInBoundsArgs, 'bounds' | 'zoom'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  vehicles?: Resolver<Array<ResolversTypes['Vehicle']>, ParentType, ContextType, RequireFields<QueryVehiclesArgs, 'userId'>>;
};

export type ReportSessionIncidentPayloadResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ReportSessionIncidentPayload'] = ResolversParentTypes['ReportSessionIncidentPayload']> = {
  incidentId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type ReserveChargingPointPayloadResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ReserveChargingPointPayload'] = ResolversParentTypes['ReserveChargingPointPayload']> = {
  session?: Resolver<ResolversTypes['ChargingSession'], ParentType, ContextType>;
};

export type SessionBookingResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SessionBooking'] = ResolversParentTypes['SessionBooking']> = {
  bookedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  cancelReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  canceledAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  expiresAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type SessionConnectionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SessionConnection'] = ResolversParentTypes['SessionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['ChargingSession']>, ParentType, ContextType>;
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type SessionConnectorUsedResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SessionConnectorUsed'] = ResolversParentTypes['SessionConnectorUsed']> = {
  power?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  tethered?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['ConnectorType']>, ParentType, ContextType>;
};

export type SessionCostResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SessionCost'] = ResolversParentTypes['SessionCost']> = {
  energyCents?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  idleCents?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  totalCents?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
};

export type SessionFeedbackResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SessionFeedback'] = ResolversParentTypes['SessionFeedback']> = {
  comment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type StartChargingSessionPayloadResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['StartChargingSessionPayload'] = ResolversParentTypes['StartChargingSessionPayload']> = {
  session?: Resolver<ResolversTypes['ChargingSession'], ParentType, ContextType>;
};

export type StationAvailabilityResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['StationAvailability'] = ResolversParentTypes['StationAvailability']> = {
  availableNowPoints?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  operationalPoints?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalPoints?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type StationClusterResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['StationCluster'] = ResolversParentTypes['StationCluster']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  location?: Resolver<ResolversTypes['GeoPoint'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StationSnapshotResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['StationSnapshot'] = ResolversParentTypes['StationSnapshot']> = {
  addressShort?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chargingPointLabel?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  location?: Resolver<ResolversTypes['GeoPoint'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type UserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['UserRole']>, ParentType, ContextType>;
};

export type VehicleResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Vehicle'] = ResolversParentTypes['Vehicle']> = {
  batteryCapacityKwh?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  connectorTypes?: Resolver<Array<ResolversTypes['ConnectorType']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  make?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  maxChargePowerKw?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  model?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  vin?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  year?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type VehicleSnapshotResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['VehicleSnapshot'] = ResolversParentTypes['VehicleSnapshot']> = {
  make?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  model?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vinLast6?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type Resolvers<ContextType = GraphQLContext> = {
  AddSessionFeedbackPayload?: AddSessionFeedbackPayloadResolvers<ContextType>;
  Address?: AddressResolvers<ContextType>;
  AdminDashboard?: AdminDashboardResolvers<ContextType>;
  AdminDashboardBreakdownItem?: AdminDashboardBreakdownItemResolvers<ContextType>;
  AdminDashboardSummary?: AdminDashboardSummaryResolvers<ContextType>;
  AdminDashboardTrendPoint?: AdminDashboardTrendPointResolvers<ContextType>;
  AdminOperatorPerformance?: AdminOperatorPerformanceResolvers<ContextType>;
  AdminRecentIncident?: AdminRecentIncidentResolvers<ContextType>;
  AdminRecentSession?: AdminRecentSessionResolvers<ContextType>;
  AdminTelemetryTrendPoint?: AdminTelemetryTrendPointResolvers<ContextType>;
  CancelChargingSessionPayload?: CancelChargingSessionPayloadResolvers<ContextType>;
  ChargingDetails?: ChargingDetailsResolvers<ContextType>;
  ChargingPointInfo?: ChargingPointInfoResolvers<ContextType>;
  ChargingSession?: ChargingSessionResolvers<ContextType>;
  ChargingStation?: ChargingStationResolvers<ContextType>;
  ChargingStationFacets?: ChargingStationFacetsResolvers<ContextType>;
  CompleteChargingSessionPayload?: CompleteChargingSessionPayloadResolvers<ContextType>;
  ConnectorFacet?: ConnectorFacetResolvers<ContextType>;
  ConnectorInfo?: ConnectorInfoResolvers<ContextType>;
  GeoPoint?: GeoPointResolvers<ContextType>;
  IdleFee?: IdleFeeResolvers<ContextType>;
  MapItem?: MapItemResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NumericRange?: NumericRangeResolvers<ContextType>;
  PricingSnapshot?: PricingSnapshotResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  ReportSessionIncidentPayload?: ReportSessionIncidentPayloadResolvers<ContextType>;
  ReserveChargingPointPayload?: ReserveChargingPointPayloadResolvers<ContextType>;
  SessionBooking?: SessionBookingResolvers<ContextType>;
  SessionConnection?: SessionConnectionResolvers<ContextType>;
  SessionConnectorUsed?: SessionConnectorUsedResolvers<ContextType>;
  SessionCost?: SessionCostResolvers<ContextType>;
  SessionFeedback?: SessionFeedbackResolvers<ContextType>;
  StartChargingSessionPayload?: StartChargingSessionPayloadResolvers<ContextType>;
  StationAvailability?: StationAvailabilityResolvers<ContextType>;
  StationCluster?: StationClusterResolvers<ContextType>;
  StationSnapshot?: StationSnapshotResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Vehicle?: VehicleResolvers<ContextType>;
  VehicleSnapshot?: VehicleSnapshotResolvers<ContextType>;
};

