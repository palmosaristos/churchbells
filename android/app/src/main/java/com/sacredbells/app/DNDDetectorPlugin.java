package com.sacredbells.app;

import android.app.NotificationManager;
import android.content.Context;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "DNDDetector")
public class DNDDetectorPlugin extends Plugin {

    @PluginMethod
    public void isDNDActive(PluginCall call) {
        try {
            Context context = getContext();
            NotificationManager notificationManager = 
                (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            
            if (notificationManager != null) {
                int filter = notificationManager.getCurrentInterruptionFilter();
                
                // INTERRUPTION_FILTER_NONE = 1 (Total silence)
                // INTERRUPTION_FILTER_PRIORITY = 2 (Priority only)
                // INTERRUPTION_FILTER_ALARMS = 4 (Alarms only)
                // INTERRUPTION_FILTER_ALL = 3 (All notifications)
                
                boolean isDND = (filter == NotificationManager.INTERRUPTION_FILTER_NONE ||
                               filter == NotificationManager.INTERRUPTION_FILTER_PRIORITY ||
                               filter == NotificationManager.INTERRUPTION_FILTER_ALARMS);
                
                JSObject result = new JSObject();
                result.put("isDNDActive", isDND);
                result.put("interruptionFilter", filter);
                call.resolve(result);
            } else {
                call.reject("NotificationManager not available");
            }
        } catch (Exception e) {
            call.reject("Error checking DND status: " + e.getMessage());
        }
    }
}
