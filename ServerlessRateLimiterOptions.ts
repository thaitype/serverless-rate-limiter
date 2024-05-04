export type NotifyChannelType =
  | {
      type: "Webhook";
      url: string;
    }
  | {
      type: "Email";
      email: string;
    }
  | {
      type: "Slack";
      url: string;
    };

export type NotifyId = string;

export type NotifyChannel = Record<NotifyId, NotifyChannelType>;

export interface RateLimitRule {
  /**
   * The name is used to identify the rate limit rule
   */
  name: string;
  /**
   * The costType is used to determine the type of the cost
   */
  costType: "Actual" | "Forecast";
  /**
   * The threshold is the limit that the rate limit rule will be applied to
   */
  threshold: number;
  /**
   * The thresholdType is used to determine the type of the threshold
   *
   * Actual: The threshold is the current cost whether it's actual or forecast
   * Percentage: The threshold is the percentage of the cost whether it's actual or forecast
   */
  thresholdType: "Actual" | "Percentage";
  /**
   * The isNotify is used to determine whether the user will be notified when the rate limit is reached
   */
  isNotify: boolean;
  /**
   * The notifyChannelId is the channel that will be used to notify the user when the rate limit is reached
   */
  notifyChannelId?: NotifyId;
  /**
   * The interval is the time between each check the rate limit rule
   *
   * Unit is hours
   */
  interval: number;
  /**
   * The action is the action that will be taken when the rate limit is reached
   */
  action: "NotifyOnly" | "Stop";
  /**
   * The target resources are the resources that the rate limit rule will be applied to
   * Apply the list when `action` is `Stop`,
   *
   * This is used to stop the resources when the rate limit is reached
   */
  targetResources: TargetResource[];
}

export interface CostTimeRange {
  /**
   * Range of time from now until the past,
   */
  timeUntilNow: number;
  /**
   * The unit is minutes
   */
  unit: "Hours" | "Days";
}

export interface TargetResource {
  type: "AzureContainerApp" | "AzureFunctionsApp";
  /**
   * How long the APIs will look back in the past to calculate the actual cost
   */
  actualCost: CostTimeRange;
  /**
   * How long the APIs will forecast the cost in the future, some APIs may not support the forecast cost
   */
  forecastCost?: CostTimeRange;
}

export interface ServerlessRateLimiterOptions {
  /**
   * Currently supported values are 'AzureContainerApp', because it's allow to scale the app to zero.
   * The provisionType is used to determine the type of the app that will be provisioned.
   * The service should support container deployment and scaling to zero for cost efficiency.
   */
  provisionType: "AzureContainerApp";
  /**
   * Define name of notify channel, used to notify the user when the rate limit is reached.
   */
  notifyChannel: NotifyChannel;
  /**
   * The rate limit rules are the rules that will be applied to the resources
   */
  rateLimitRules: RateLimitRule[];
}
